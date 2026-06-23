import { Inngest } from "inngest";
import { INNGEST_BASE_URL } from "$env/static/private";
import { sendSMS } from "./send-sms";

export const inngest = new Inngest({
  id: "woloroofing",
  baseUrl: INNGEST_BASE_URL,
});

const sendFirstSMS = inngest.createFunction(
  {
    id: "send-first-sms",
    triggers: { event: "twilio/send.sms" },
  },
  async ({ event, step }) => {
    const { phone } = event.data;

    if (!phone) {
      throw new Error("Missing phone number in sendFirstSMS");
    }

    await step.sleep("wait-before-sending-sms", "60s");

    const result = await step.run("send-sms-via-twilio", async () => {
      return sendSMS(
        phone,
        "Hey this is Simon from WOLO Roofing. We saw that you submitted a form. How can we help you?",
      );
    });

    return { success: true, result };
  },
);

export const functions = [sendFirstSMS];
