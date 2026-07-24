ALTER TABLE "user" ADD COLUMN "is_guest" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "guest_token" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "guest_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_guest_token_unique" UNIQUE("guest_token");