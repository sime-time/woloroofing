import twilio from "twilio";
//import { WOLOPHONE_HREF } from "$lib/contact-info";

export async function POST() {
  //const phone = WOLOPHONE_HREF.replace("tel:", "");
  const phone = "+13177778167";

  const response = new twilio.twiml.VoiceResponse();

  response.say("Please hold while we connect you.");
  response.dial(phone);

  return new Response(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
