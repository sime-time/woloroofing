CREATE TYPE "public"."estimate_result_type" AS ENUM('roof_replacement', 'storm_damage', 'possible_repair', 'exterior_only', 'general');--> statement-breakpoint
CREATE TYPE "public"."preferred_contact" AS ENUM('sms', 'email');--> statement-breakpoint
CREATE TABLE "quiz_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"answers" jsonb NOT NULL,
	"estimate_low" integer NOT NULL,
	"estimate_high" integer NOT NULL,
	"result_type" "estimate_result_type" DEFAULT 'general' NOT NULL,
	"customer_message" text NOT NULL,
	"owner_summary" text NOT NULL,
	"preferred_contact" "preferred_contact" NOT NULL,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "preferred_contact" "preferred_contact";--> statement-breakpoint
ALTER TABLE "quiz_submissions" ADD CONSTRAINT "quiz_submissions_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;