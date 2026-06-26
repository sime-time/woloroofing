ALTER TABLE "leads" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_phone_unique" UNIQUE("phone");