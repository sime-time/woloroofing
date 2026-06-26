import type { RequestHandler } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import twilio from "twilio";
import { TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from "$env/static/private";
import { PUBLIC_SITE_URL } from "$env/static/public";
import { WOLOPHONE } from "$lib/contact-info";
import normalizePhoneToE164 from "$lib/normalize-phone";
import { respond } from "$lib/server/chat";

export const POST: RequestHandler = async ({ request, url }) => {
  const formData = await request.formData();

  const params = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [
      key,
      value.toString(),
    ]),
  );

  const signature = request.headers.get("x-twilio-signature") ?? "";
  const webhookUrl = `${PUBLIC_SITE_URL}${url.pathname}`;

  const isValidTwilioRequest = twilio.validateRequest(
    TWILIO_AUTH_TOKEN,
    signature,
    webhookUrl,
    params,
  );

  if (!isValidTwilioRequest) {
    throw error(403, "Invalid Twilio signature");
  }

  const from = formData.get("From")?.toString(); // homeowner phone number
  const to = formData.get("To")?.toString(); // twilio phone number
  const body = formData.get("Body")?.toString().trim(); // SMS text

  try {
    if (!body) throw new Error("SMS text is empty");

    if (to !== TWILIO_PHONE_NUMBER)
      throw new Error("Twilio phone does not match 'to' field formData");

    const phone = normalizePhoneToE164(from || "");

    if (!phone) {
      throw new Error("Phone number is invalid E164 or not US number");
    }

    // Generate AI response text
    const text = await respond(phone, body);

    const response = new twilio.twiml.MessagingResponse();
    response.message(text);

    return new Response(response.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    console.error("Failed to process sms", err);

    const response = new twilio.twiml.MessagingResponse();
    response.message(
      `Sorry, I'm having trouble replying right now. Please call ${WOLOPHONE} and we'll help you directly.`,
    );

    return new Response(response.toString(), {
      headers: { "Content-Type": "text/xml" },
      status: 200,
    });
  }
};
