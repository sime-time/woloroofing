import { tool } from "ai";
import z from "zod";
import { BOOKING_LINK, WOLOPHONE_HREF } from "$lib/contact-info";
import {
  bookInspection as bookCalInspection,
  getAvailableInspectionSlots as getCalAvailableInspectionSlots,
  type TimePreference,
} from "$lib/server/cal-com";
import {
  createAppointment,
  updateLatestAppointmentSummaryByLeadId,
} from "$lib/server/queries/appointments";
import type { Lead } from "$lib/server/queries/leads";
import { updateLead } from "$lib/server/queries/leads";
import { sendSMS } from "$lib/server/send-sms";
import { addMessage } from "../queries/messages";

export function createTools(lead: Lead) {
  const saveLeadDetails = tool({
    description:
      "Save lead details collected during the SMS conversation, including name, email, address, and homeowners insurance provider.",
    inputSchema: z.object({
      name: z.string().trim().min(1).optional(),
      email: z.email().optional(),
      address: z.string().trim().min(1).optional(),
      insuranceProvider: z.string().trim().min(1).optional(),
    }),
    execute: async ({ name, email, address, insuranceProvider }) => {
      console.log("[tool] Save lead details for", lead.id);

      const updatedLead = await updateLead(lead.id, {
        name,
        email,
        address,
        insurance: insuranceProvider,
      });

      return {
        success: true,
        lead: {
          id: updatedLead.id,
          name: updatedLead.name,
          email: updatedLead.email,
          address: updatedLead.address,
          insurance: updatedLead.insurance,
        },
      };
    },
  });

  const getAvailableInspectionSlots = tool({
    description:
      "Fetch real Cal.com availability for a free WOLO inspection and return a few easy SMS-friendly time options.",
    inputSchema: z.object({
      startDate: z
        .string()
        .describe(
          "Start date or datetime for the availability search, as YYYY-MM-DD or ISO 8601.",
        ),
      endDate: z
        .string()
        .describe(
          "End date or datetime for the availability search, as YYYY-MM-DD or ISO 8601.",
        ),
      timePreference: z
        .enum(["morning", "afternoon", "evening", "anytime"])
        .optional()
        .describe("Optional lead preference for time of day."),
    }),
    execute: async ({ startDate, endDate, timePreference }) => {
      console.log("[tool] Get available inspection slots for", lead.id);

      const slots = await getCalAvailableInspectionSlots({
        startDate,
        endDate,
        timePreference: timePreference as TimePreference | undefined,
      });

      return {
        success: true,
        slots,
        message:
          slots.length > 0
            ? "Offer these appointment options to the lead. Use the start value only for a future booking tool call."
            : "No matching appointment slots were found. Ask if another day or time of day works.",
      };
    },
  });

  const bookInspection = tool({
    description:
      "Create the actual Cal.com booking for a free WOLO inspection after the lead chooses a real available slot and provides required contact details.",
    inputSchema: z.object({
      start: z
        .string()
        .min(1)
        .describe(
          "The exact slot start value returned by getAvailableInspectionSlots. Must be an ISO date string.",
        ),
      name: z.string().trim().min(1),
      email: z.email(),
      phone: z
        .string()
        .trim()
        .min(1)
        .describe("The lead's phone number in E.164 format if available."),
      address: z
        .string()
        .trim()
        .min(1)
        .describe("The inspection address for the attendeeAddress location."),
      damageType: z.string().trim().min(1).optional(),
      insuranceProvider: z.string().trim().min(1).optional(),
      notes: z.string().trim().min(1).optional(),
    }),
    execute: async ({
      start,
      name,
      email,
      phone,
      address,
      damageType,
      insuranceProvider,
      notes,
    }) => {
      console.log("[tool] Book inspection for", lead.id);

      const booking = await bookCalInspection({
        start,
        name,
        email,
        phone: lead.phone ?? phone,
        address,
        damageType,
        insuranceProvider,
        notes,
        leadId: lead.id,
      });

      await updateLead(lead.id, {
        name,
        email,
        address,
        insurance: insuranceProvider,
      });

      await createAppointment({
        lead_id: lead.id,
        cal_booking_id: booking.uid,
        scheduled_at: new Date(booking.start),
        summary: [
          `NAME: ${name}`,
          `PHONE: ${lead.phone ?? phone}`,
          `EMAIL: ${email}`,
          `ADDRESS: ${address}`,
          `DAMAGE TYPE: ${damageType ?? "Unknown"}`,
          `INSURANCE PROVIDER: ${insuranceProvider ?? "Unknown"}`,
          `APPOINTMENT TIME: ${formatAppointmentTime(booking.start)}`,
          `NOTES: ${notes ?? ""}`,
        ].join("\n"),
      });

      return {
        success: true,
        booking: {
          id: booking.id,
          uid: booking.uid,
          start: booking.start,
          end: booking.end,
          status: booking.status,
          appointmentTime: formatAppointmentTime(booking.start),
        },
      };
    },
  });

  const sendBookingSummaryToOwner = tool({
    description:
      "Send David a structured SMS summary after a Cal.com inspection booking is confirmed, and store the exact summary on the latest appointment row for this lead.",
    inputSchema: z.object({
      appointmentStart: z
        .string()
        .trim()
        .min(1)
        .describe(
          "The confirmed booking start time as an ISO date string returned by bookInspection.",
        ),
      name: z.string().trim().min(1),
      phone: z.string().trim().min(1),
      address: z.string().trim().min(1),
      damageType: z.string().trim().min(1).optional(),
      insuranceProvider: z.string().trim().min(1).optional(),
      notes: z.string().trim().min(1).optional(),
    }),
    execute: async ({
      appointmentStart,
      name,
      phone,
      address,
      damageType,
      insuranceProvider,
      notes,
    }) => {
      console.log("[tool] Send booking summary to owner for", lead.id);

      const appointmentTime = formatAppointmentTime(appointmentStart);

      const summary = [
        "New Inspection Booked",
        `NAME: ${name}`,
        `PHONE: ${phone}`,
        `ADDRESS: ${address}`,
        `DAMAGE TYPE: ${damageType ?? "Unknown"}`,
        `INSURANCE PROVIDER: ${insuranceProvider ?? "Unknown"}`,
        `APPOINTMENT TIME: ${appointmentTime}`,
        `NOTES: ${notes ?? ""}`,
      ].join("\n");

      await updateLatestAppointmentSummaryByLeadId(lead.id, summary);

      const woloPhone = WOLOPHONE_HREF.replace("tel:", "");
      const twilioMessage = await sendSMS(woloPhone, summary);

      return {
        success: true,
        messageSid: twilioMessage.sid,
        summary,
      };
    },
  });

  const sendBookingLink = tool({
    description:
      "Send the Cal.com free inspection booking link to this lead by SMS after they are qualified.",
    inputSchema: z.object({}),
    execute: async () => {
      if (!lead.phone) {
        throw new Error("Phone number not found");
      }
      console.log("[tool] Send booking link to", lead.phone);

      try {
        const twilioMessage = await sendSMS(lead.phone, BOOKING_LINK);
        await addMessage({
          leadId: lead.id,
          content: BOOKING_LINK,
          role: "assistant",
        });

        return { success: true, messageSid: twilioMessage.sid };
      } catch (err) {
        console.error("[tool] Twilio send sms failed", err);
        throw new Error("Failed to send booking link");
      }
    },
  });

  return {
    saveLeadDetails,
    getAvailableInspectionSlots,
    bookInspection,
    sendBookingSummaryToOwner,
    sendBookingLink,
  };
}

function formatAppointmentTime(start: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: "America/Indiana/Indianapolis",
  }).format(new Date(start));
}
