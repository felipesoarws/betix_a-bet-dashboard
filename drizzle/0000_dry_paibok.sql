CREATE TYPE "public"."bet_category_enum" AS ENUM('futebol', 'basquete', 'tenis', 'outro');--> statement-breakpoint
CREATE TYPE "public"."result_enum" AS ENUM('ganha', 'perdida', 'pendente', 'anulada');--> statement-breakpoint
CREATE TABLE "bets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"event" text NOT NULL,
	"category" "bet_category_enum" NOT NULL,
	"bet_value" numeric(10, 2) NOT NULL,
	"odd" numeric(5, 2) NOT NULL,
	"result" "result_enum" NOT NULL,
	"profit" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "bets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "bets" USING btree ("created_at");