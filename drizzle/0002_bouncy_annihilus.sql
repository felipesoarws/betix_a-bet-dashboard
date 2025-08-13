ALTER TABLE "bets" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bets" ALTER COLUMN "result" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."bet_category_enum";--> statement-breakpoint
DROP TYPE "public"."result_enum";