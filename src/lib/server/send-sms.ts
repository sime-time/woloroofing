import twilio from "twilio";
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} from "$env/static/private";

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendSMS(phoneNumber: string) {
  const message = await client.messages.create({
    body: "Test message",
    from: TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });

  console.log("Send SMS:", message.body);
}
