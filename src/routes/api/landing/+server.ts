import { json } from "@sveltejs/kit";
import z from "zod";
import { SMS_CONSENT_TEXT } from "$lib/contact-info";
import normalizePhoneToE164 from "$lib/normalize-phone";
import { createLeadSMS } from "$lib/server/queries/leads";
import { addMessage } from "$lib/server/queries/messages";
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

  // Create first follow up message to send
  const firstText = `Hey ${contact.name}, this is Simon from WOLO Roofing. Just got your message, can you describe what damages your roof has?`;

  try {
    // Insert new lead into database
    const lead = await createLeadSMS({
      name: contact.name,
      phone: contact.phone,
      sms_consent: contact.consent === "on",
      sms_consent_text: SMS_CONSENT_TEXT,
      sms_consent_at: new Date(),
    });

    // Insert new message into database
    await addMessage({
      leadId: lead.id,
      content: firstText,
      role: "assistant",
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

  // Trigger an sms message within 60 seconds
  await sendSMS(contact.phone, firstText);

  return json({ success: true });
};
