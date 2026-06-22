import { json } from "@sveltejs/kit";
import z from "zod";
import { SMS_CONSENT_TEXT } from "$lib/contact-info";
import normalizePhoneToE164 from "$lib/normalize-phone";
import { createLeadSMS } from "$lib/server/queries/leads";
import { getRequestIp, validateTurnstile } from "$lib/server/turnstile";
import type { RequestHandler } from "./$types";

const landingSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Please enter your name.",
  }),
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
  consent: z.literal("on", {
    error: "Please agree to receive texts so we can schedule your inspection.",
  }),
});

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData();

  const values = {
    name: form.get("name"),
    phone: form.get("phone"),
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
        errors: [{ message: "Verification failed. Please try again." }],
      },
      { status: 400 },
    );
  }

  const contact = validation.data;

  // Insert new lead into database
  try {
    await createLeadSMS({
      name: contact.name,
      phone: contact.phone,
      sms_consent: contact.consent === "on",
      sms_consent_text: SMS_CONSENT_TEXT,
      sms_consent_at: new Date(),
    });
  } catch (err) {
    console.error("Lead insertion error:", err);
    return json(
      {
        errors: [
          { message: "Your contact info was not saved. Please try again." },
        ],
      },
      { status: 500 },
    );
  }

  return json({ success: true });
};
