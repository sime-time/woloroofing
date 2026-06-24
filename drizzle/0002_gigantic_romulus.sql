DROP INDEX "messages_external_id_unique";--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "sms_consent_text" SET DEFAULT 'I agree to receive text messages from WOLO Roofing about my inspection request. Msg & data rates may apply.';--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "external_id";--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "metadata";