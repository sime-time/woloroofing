import { json } from "@sveltejs/kit";
import { Resend } from "resend";
import z from "zod";
import { RESEND_API_KEY } from "$env/static/private";
import { WOLOEMAIL } from "$lib/contact-info";
import { createLeadEmail } from "$lib/server/queries/leads";
import { getRequestIp, validateTurnstile } from "$lib/server/turnstile";
import type { RequestHandler } from "./$types";

const resend = new Resend(RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  service: z.string().trim().min(1, "Enter what service can we help you with"),
  message: z.string().trim().optional(),
});

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData();

  // Validate form input
  const validation = contactSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    service: form.get("service"),
    message: form.get("message"),
  });

  if (!validation.success) {
    return json(
      {
        success: false,
        resetTurnstile: false,
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
    // json errors must be the same shape as ZodError (errors.issues[0].message)
    return json(
      {
        success: false,
        resetTurnstile: true,
        errors: [{ message: "Verification failed. Please try again." }],
      },
      { status: 400 },
    );
  }

  const contact = validation.data;

  // Insert new lead into database
  try {
    await createLeadEmail({
      name: contact.name,
      email: contact.email,
      service: contact.service,
      message: contact.message,
    });
  } catch (err) {
    console.error("Lead insertion error:", err);
    return json(
      {
        success: false,
        resetTurnstile: true,
        errors: [{ message: "Your message did not save. Please try again." }],
      },
      { status: 500 },
    );
  }

  // Notify woloroofing business email
  const { data, error } = await resend.emails.send({
    from: "WOLO Roofing Leads <leads@updates.woloroofing.com>",
    to: [WOLOEMAIL],
    replyTo: contact.email,
    subject: "New Lead from Contact Form",
    text: `
New contact form submission

Name: ${contact.name}
Email: ${contact.email}
Service: ${contact.service}

Message:
${contact.message || "No message provided"}`,
  });

  if (error) {
    return json(
      {
        success: false,
        resetTurnstile: true,
        errors: [{ message: "Could not send message. Please try again." }],
      },
      { status: 500 },
    );
  }

  return json({
    data,
    success: true,
  });
};
