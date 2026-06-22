import parsePhoneNumber from "libphonenumber-js";

export default function normalizePhoneToE164(input: string) {
  const phoneNumber = parsePhoneNumber(input, "US");
  if (!phoneNumber?.isValid()) {
    return null;
  }
  return phoneNumber.number;
}
