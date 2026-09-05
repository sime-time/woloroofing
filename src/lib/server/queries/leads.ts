import { eq } from "drizzle-orm";
import normalizePhoneToE164 from "$lib/normalize-phone";
import { db } from "$lib/server/db";
import { leads } from "$lib/server/db/schema";

export type NewLead = typeof leads.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type LeadUpdate = Partial<
  Pick<Lead, "name" | "email" | "address" | "insurance">
>;

export async function findOrCreateLeadSMS({
  name,
  phone,
  sms_consent,
  sms_consent_text,
  sms_consent_at = new Date(),
  message,
  email,
}: {
  name: string;
  phone: string;
  sms_consent: boolean;
  sms_consent_text: string;
  sms_consent_at?: Date;
  message?: string;
  email?: string;
}) {
  const newLead: NewLead = {
    name,
    phone,
    sms_consent,
    sms_consent_text,
    sms_consent_at,
    initial_message: message,
    email,
  };

  const [inserted] = await db
    .insert(leads)
    .values(newLead)
    .onConflictDoNothing({ target: leads.phone })
    .returning();

  if (inserted) return inserted as Lead;

  const [found] = await db
    .select()
    .from(leads)
    .where(eq(leads.phone, phone))
    .limit(1);

  if (found) return found as Lead;

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

export async function findOrCreateLeadByPhone(phone: string) {
  const normalizedPhone = normalizePhoneToE164(phone);
  if (!normalizedPhone)
    throw new Error("Invalid phone number could not be normalized");

  const [inserted] = await db
    .insert(leads)
    .values({ phone: normalizedPhone })
    .onConflictDoNothing({ target: leads.phone })
    .returning();

  if (inserted) return inserted as Lead;

  const [found] = await db
    .select()
    .from(leads)
    .where(eq(leads.phone, normalizedPhone))
    .limit(1);

  if (found) return found as Lead;

  throw new Error("Could not find or create a new lead");
}

export async function updateLead(id: string, input: LeadUpdate) {
  const values = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as LeadUpdate;

  if (Object.keys(values).length === 0) {
    const [found] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, id))
      .limit(1);

    if (found) return found as Lead;

    throw new Error("Lead not found");
  }

  const [updated] = await db
    .update(leads)
    .set(values)
    .where(eq(leads.id, id))
    .returning();

  if (updated) return updated as Lead;

  throw new Error("Lead update failed");
}

/*
getLeadById(id)
getLeadByEmail(email)
*/
