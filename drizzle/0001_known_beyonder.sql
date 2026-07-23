CREATE TYPE "public"."drink_choice" AS ENUM('Tea', 'Coffee', 'Green tea', 'Milk', 'No drink');--> statement-breakpoint
CREATE TYPE "public"."drink_period" AS ENUM('morning', 'evening');--> statement-breakpoint
CREATE TYPE "public"."drink_source" AS ENUM('default', 'manual');--> statement-breakpoint
ALTER TABLE "drink_default" ALTER COLUMN "period" SET DATA TYPE "public"."drink_period" USING "period"::"public"."drink_period";--> statement-breakpoint
ALTER TABLE "drink_default" ALTER COLUMN "drink" SET DEFAULT 'No drink'::"public"."drink_choice";--> statement-breakpoint
ALTER TABLE "drink_default" ALTER COLUMN "drink" SET DATA TYPE "public"."drink_choice" USING "drink"::"public"."drink_choice";--> statement-breakpoint
ALTER TABLE "drink_default" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "drink_default" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "drink_response" ALTER COLUMN "period" SET DATA TYPE "public"."drink_period" USING "period"::"public"."drink_period";--> statement-breakpoint
ALTER TABLE "drink_response" ALTER COLUMN "drink" SET DATA TYPE "public"."drink_choice" USING "drink"::"public"."drink_choice";--> statement-breakpoint
ALTER TABLE "drink_response" ALTER COLUMN "source" SET DATA TYPE "public"."drink_source" USING "source"::"public"."drink_source";--> statement-breakpoint
ALTER TABLE "drink_response" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "drink_response" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "drink_response" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "drink_response" ALTER COLUMN "updated_at" SET DEFAULT now();