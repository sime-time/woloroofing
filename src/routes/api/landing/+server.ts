import { json } from "@sveltejs/kit";
import z from "zod";
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
  const data = await request.formData();

  const values = {
    name: data.get("name"),
    phone: data.get("phone"),
    consent: data.get("consent"),
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
  // send email to David
  // insert into Postgres

  return json({ success: true });
};
