import { tool } from "ai";
import z from "zod";
import { BOOKING_LINK } from "$lib/contact-info";
import type { Lead } from "$lib/server/queries/leads";
import { sendSMS } from "$lib/server/send-sms";

export function createTools(lead: Lead) {
  const sendBookingLink = tool({
    description: "",
    inputSchema: z.object({}),
    execute: async () => {
      if (!lead.phone) {
        throw new Error("Phone number not found");
      }
      console.log("[tool] Send booking link to", lead.phone);

      try {
        const twilioMessage = await sendSMS(lead.phone, BOOKING_LINK);

        return { success: true, message: twilioMessage };
      } catch (err) {
        console.error("[tool] Twilio send sms failed", err);
        throw new Error("Failed to send booking link");
      }
    },
  });

  return { sendBookingLink };
}
