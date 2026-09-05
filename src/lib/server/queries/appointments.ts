import { desc, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { appointments } from "$lib/server/db/schema";

export type NewAppointment = typeof appointments.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;

export async function createAppointment(input: NewAppointment) {
  const [inserted] = await db.insert(appointments).values(input).returning();

  if (inserted) return inserted as Appointment;

  throw new Error("CreateAppointment insert failed");
}

export async function updateAppointmentSummaryByCalBookingId(
  calBookingId: string,
  summary: string,
) {
  const [updated] = await db
    .update(appointments)
    .set({ summary })
    .where(eq(appointments.cal_booking_id, calBookingId))
    .returning();

  if (updated) return updated as Appointment;

  throw new Error("Appointment summary update failed");
}

export async function updateLatestAppointmentSummaryByLeadId(
  leadId: string,
  summary: string,
) {
  const [latest] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.lead_id, leadId))
    .orderBy(desc(appointments.created_at))
    .limit(1);

  if (!latest) {
    throw new Error("Appointment not found");
  }

  const [updated] = await db
    .update(appointments)
    .set({ summary })
    .where(eq(appointments.id, latest.id))
    .returning();

  if (updated) return updated as Appointment;

  throw new Error("Appointment summary update failed");
}

/*
getAppointmentByCalBookingId(calBookingId)
getAppointmentsByLeadId(leadId)
updateAppointmentStatus(id, status)
cancelAppointmentByCalBookingId(calBookingId)
*/
