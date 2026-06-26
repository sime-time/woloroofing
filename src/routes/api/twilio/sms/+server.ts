import type { RequestHandler } from "@sveltejs/kit";
import twilio from "twilio";
import normalizePhoneToE164 from "$lib/normalize-phone";
import { respond } from "$lib/server/chat";

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();

  const from = formData.get("From")?.toString(); // homeowner phone number
  const to = formData.get("To")?.toString(); // twilio phone number
  const body = formData.get("Body")?.toString().trim(); // SMS text

  console.log(JSON.stringify({ from, to, body }, null, 2));

  const phone = normalizePhoneToE164(from || "");
  if (!phone) throw new Error("Phone number is invalid E164 or not US number");
  if (!body) throw new Error("SMS text is empty");

  // Generate AI response text
  const text = await respond(phone, body);

  const response = new twilio.twiml.MessagingResponse();
  response.message(text);

  return new Response(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
};
