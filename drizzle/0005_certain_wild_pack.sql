ALTER TABLE "bets" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "bets" ADD COLUMN "unit" numeric(10, 2) NOT NULL;