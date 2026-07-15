import "dotenv/config";
import twilio from "twilio";

const TO_PHONE_NUMBER = "+18476825236"; // Example: "+13175551212"
const TEST_MESSAGE = `New Lead: Christine Adkins\n+17655090789\nMsg: After thebig strom we had the roof mess up

AI sent: Hey Christine! Sorry to hear the storm damaged your roof. Are you the homeowner, or should we connect with whoever makes the call on repairs?`;

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const message = await client.messages.create({
  body: TEST_MESSAGE,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: TO_PHONE_NUMBER,
});

console.log({
  sid: message.sid,
  status: message.status,
  from: message.from,
  to: message.to,
  errorCode: message.errorCode,
  errorMessage: message.errorMessage,
});
