import { json } from "@sveltejs/kit";
import z from "zod";
import { getRequestIp, validateTurnstile } from "$lib/server/turnstile";
import type { RequestHandler } from "./$types";

const landingSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Please enter your name.",
  }),
  phone: z
    .string()
    .trim()
    .min(1, {
      message: "Please enter a phone number we can text.",
    })
    .regex(/^[\d\s()+.-]{7,}$/, {
      message: "Please enter a valid phone number.",
    }),
  consent: z.literal("on", {
    error: "Please agree to receive texts so we can schedule your inspection.",
  }),
});

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData();

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

  // TODO:
  // insert into Postgres

  return json({ success: true });
};
