CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_settings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_settings" CASCADE;--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_unit_unique";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "name_user_id_unique_idx" ON "categories" USING btree ("name","user_id");--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "unit";