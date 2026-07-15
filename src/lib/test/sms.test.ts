import "dotenv/config";
import twilio from "twilio";

const TO_PHONE_NUMBER = "+18476825236"; // Set this to the test number in E.164 format, for example: +13175551212
const TEST_MESSAGE = "";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function assertE164(phoneNumber: string) {
  if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
    throw new Error(
      `Invalid test phone number: ${phoneNumber || "<empty>"}. Use E.164 format, for example +13175551212.`,
    );
  }
}

async function main() {
  assertE164(TO_PHONE_NUMBER);

  const accountSid = requireEnv("TWILIO_ACCOUNT_SID");
  const authToken = requireEnv("TWILIO_AUTH_TOKEN");
  const from = requireEnv("TWILIO_PHONE_NUMBER");

  assertE164(from);

  const client = twilio(accountSid, authToken);
  const message = await client.messages.create({
    body: TEST_MESSAGE,
    from,
    to: TO_PHONE_NUMBER,
  });

  console.log({
    sid: message.sid,
    status: message.status,
    from,
    to: TO_PHONE_NUMBER,
  });
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
