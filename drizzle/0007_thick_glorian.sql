CREATE TYPE "public"."guest_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'guest');--> statement-breakpoint
CREATE TABLE "company" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email_ending_1" text NOT NULL,
	"email_ending_2" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_name_unique" UNIQUE("name")
);
--> statement-breakpoint
INSERT INTO "company" ("id", "name", "email_ending_1", "email_ending_2") VALUES ('mygate', 'Mygate', '@mygate.in', '@mygate.com') ON CONFLICT ("id") DO NOTHING;--> statement-breakpoint
CREATE TABLE "company_admin" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_admin_company_id_email_unique" UNIQUE("company_id","email")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "company_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "guest_status" "guest_status";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "guest_requested_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "guest_reviewed_at" timestamp with time zone;--> statement-breakpoint
UPDATE "user" SET "company_id" = 'mygate' WHERE "company" = 'Mygate';--> statement-breakpoint
UPDATE "user" SET "guest_status" = 'approved' WHERE "is_guest" = true AND "guest_status" IS NULL;--> statement-breakpoint
ALTER TABLE "company_admin" ADD CONSTRAINT "company_admin_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "company_admin_email_idx" ON "company_admin" USING btree ("email");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE set null ON UPDATE no action;
