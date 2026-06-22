import { WOLOPHONE_HREF } from "$lib/contact-info";

// Handle Twilio phone number voice call re-routes
export async function POST() {
  //const phone = WOLOPHONE_HREF.split(":")[1];
  const phone = "+13177778167";

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Please hold while we connect you.</Say>
  <Dial>
    <Number>${phone}</Number>
  </Dial>
</Response>`;

  return new Response(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}
