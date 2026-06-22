import { db } from "$lib/server/db";
import { leads } from "$lib/server/db/schema";

export type NewLead = typeof leads.$inferInsert;
export type Lead = typeof leads.$inferSelect;

export async function createLeadSMS({
  name,
  phone,
  sms_consent,
  sms_consent_text,
  sms_consent_at = new Date(),
  email,
}: {
  name: string;
  phone: string;
  sms_consent: boolean;
  sms_consent_text: string;
  sms_consent_at?: Date;
  email?: string;
}) {
  const newLead: NewLead = {
    name,
    phone,
    sms_consent,
    sms_consent_text,
    sms_consent_at,
    email,
  };

  const [inserted] = await db.insert(leads).values(newLead).returning();

  if (inserted) return inserted as Lead;

  throw new Error("CreateLeadSMS insert failed");
}

export async function createLeadEmail({
  name,
  email,
  service,
  message,
}: {
  name: string;
  email: string;
  service: string;
  message?: string;
}) {
  const newLead: NewLead = {
    name,
    email,
    requested_service: service,
    initial_message: message,
  };

  const [inserted] = await db.insert(leads).values(newLead).returning();

  if (inserted) return inserted as Lead;

  throw new Error("CreateLeadEmail insert failed");
}

/*
createLeadSMS(input) x 
createLeadEmail(input) x 
updateLead(id, input)
getLeadById(id)
getLeadByPhone(phone)
getLeadByEmail(email)
*/
