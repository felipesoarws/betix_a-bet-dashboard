ALTER TABLE "account" ADD COLUMN "unit" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "unit";--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_unit_unique" UNIQUE("unit");