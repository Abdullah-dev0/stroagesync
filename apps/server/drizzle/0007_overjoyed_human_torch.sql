CREATE TYPE "public"."storage_item_status" AS ENUM('pending', 'ready');--> statement-breakpoint
ALTER TABLE "storage_item" ADD COLUMN "status" "storage_item_status" DEFAULT 'ready' NOT NULL;