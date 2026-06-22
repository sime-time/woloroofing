import { twiml } from "twilio";
import { WOLOPHONE_HREF } from "$lib/contact-info";

const { VoiceResponse } = twiml;

export async function POST() {
  //const phone = WOLOPHONE_HREF.replace("tel:", "");
  const phone = "+13177778167";

  const response = new VoiceResponse();

  response.say("Please hold while we connect you.");
  response.dial(phone);

  return new Response(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
