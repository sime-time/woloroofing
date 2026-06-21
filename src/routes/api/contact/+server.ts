import { json } from "@sveltejs/kit";
import { Resend } from "resend";
import z from "zod";
import { RESEND_API_KEY } from "$env/static/private";
import { WOLOEMAIL } from "$lib/contact-info";
import type { RequestHandler } from "./$types";

const resend = new Resend(RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  service: z.string(),
  message: z.string().trim().optional(),
});

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData();

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
        errors: validation.error.issues,
      },
      { status: 400 },
    );
  }

  const contact = validation.data;

  const { data, error } = await resend.emails.send({
    from: "WOLO Roofing <leads@updates.woloroofing.com>",
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
    // errors must be the same shape as ZodError
    return json(
      { errors: [{ message: "Could not send message. Please try again." }] },
      { status: 500 },
    );
  }

  // TODO:
  // insert into Postgres

  return json({
    data,
    success: true,
  });
};
