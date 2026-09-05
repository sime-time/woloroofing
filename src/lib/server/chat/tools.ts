import { tool } from "ai";
import z from "zod";
import { BOOKING_LINK } from "$lib/contact-info";
import {
  getAvailableInspectionSlots as getCalAvailableInspectionSlots,
  type TimePreference,
} from "$lib/server/cal-com";
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

  return { saveLeadDetails, getAvailableInspectionSlots, sendBookingLink };
}
