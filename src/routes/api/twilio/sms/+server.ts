import twilio from "twilio";

export async function POST() {
  const response = new twilio.twiml.MessagingResponse();

  response.message("The robots are coming! Head for the hills!");

  return new Response(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
