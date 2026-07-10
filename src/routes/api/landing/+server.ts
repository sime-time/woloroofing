import { json } from "@sveltejs/kit";
import z from "zod";
import { SMS_CONSENT_TEXT } from "$lib/contact-info";
import normalizePhoneToE164 from "$lib/normalize-phone";
import { respond } from "$lib/server/chat";
import { findOrCreateLeadSMS } from "$lib/server/queries/leads";
import { sendSMS } from "$lib/server/send-sms";
import { getRequestIp, validateTurnstile } from "$lib/server/turnstile";
import type { RequestHandler } from "./$types";

const landingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Please enter your name.",
    })
    // Capitalize the first letter in the name
    .transform((name) => name.charAt(0).toUpperCase() + name.slice(1)),
  phone: z
    .string()
    .trim()
    .min(7, {
      message: "Please enter a phone number we can text.",
    })
    .transform((phone) => normalizePhoneToE164(phone))
    .refine((phone) => phone !== null, {
      message: "Please enter a valid 10-digit phone number.",
    }),
  message: z
    .string()
    .trim()
    .min(5, { message: "Please explain what happened." }),
  consent: z.literal("on", {
    error: "Please agree to receive texts so we can schedule your inspection.",
  }),
});

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData();

  const values = {
    name: form.get("name"),
    phone: form.get("phone"),
    message: form.get("message"),
    consent: form.get("consent"),
  };

  const validation = landingSchema.safeParse(values);

  if (!validation.success) {
    return json(
      {
        success: false,
        errors: validation.error.issues,
      },
      { status: 400 },
    );
  }

  // Cloudflare turnstile verification AFTER input validation
  const token = form.get("cf-turnstile-response");
  const remoteip = getRequestIp(request);

  const turnstile = await validateTurnstile(token, remoteip);

  if (!turnstile.success) {
    // json errors must be the same shape as ZodError (error.issues[0].message)
    return json(
      {
        success: false,
        errors: [
          {
            message:
              "Verification failed. Please refresh the page and try again.",
          },
        ],
      },
      { status: 400 },
    );
  }

  const contact = validation.data;

  try {
    // Insert new lead into database
    await findOrCreateLeadSMS({
      name: contact.name,
      phone: contact.phone,
      message: contact.message,
      sms_consent: contact.consent === "on",
      sms_consent_text: SMS_CONSENT_TEXT,
      sms_consent_at: new Date(),
    });
  } catch (err) {
    console.error("Database insertion error:", err);
    return json(
      {
        success: false,
        errors: [
          {
            message:
              "Your contact info was not saved. Please refresh the page and try again.",
          },
        ],
      },
      { status: 500 },
    );
  }

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  void (async () => {
    try {
      await delay(60_000);

      const firstResponse = await respond(contact.phone, contact.message);
      await sendSMS(contact.phone, firstResponse);
    } catch (err) {
      console.error("Failed to send delayed follow up message:", err);
    }
  })();

  return json({ success: true });
};
