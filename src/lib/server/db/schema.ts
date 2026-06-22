import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { SMS_CONSENT_TEXT } from "$lib/contact-info";

const timestamps = () => ({
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const messageRole = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
]);
export const appointmentStatus = pgEnum("appointment_status", [
  "scheduled",
  "completed",
  "cancelled",
]);

export const leads = pgTable("leads", {
  id: uuid().defaultRandom().primaryKey(),

  name: text().notNull(),
  phone: text(),
  email: text(),
  address: text(),

  requested_service: text(),
  initial_message: text(),
  insurance: text(),

  sms_consent: boolean().default(false),
  sms_consent_text: text().default(SMS_CONSENT_TEXT),
  sms_consent_at: timestamp(),

  ...timestamps(),
});

export const messages = pgTable(
  "messages",
  {
    id: uuid().defaultRandom().primaryKey(),
    lead_id: uuid()
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),

    role: messageRole().notNull(),
    content: text().notNull(),
    external_id: text(),
    metadata: jsonb(),

    ...timestamps(),
  },
  (table) => [
    index("messages_lead_id_idx").on(table.lead_id),
    index("messages_created_at_idx").on(table.created_at),
    uniqueIndex("messages_external_id_unique").on(table.external_id),
  ],
);

export const appointments = pgTable(
  "appointments",
  {
    id: uuid().defaultRandom().primaryKey(),
    lead_id: uuid()
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),

    cal_booking_id: text(),
    status: appointmentStatus().notNull().default("scheduled"),
    scheduled_at: timestamp(),
    summary: text(),

    ...timestamps(),
  },
  (table) => [
    index("appointments_lead_id_idx").on(table.lead_id),
    uniqueIndex("appointments_cal_booking_id_unique").on(table.cal_booking_id),
  ],
);
