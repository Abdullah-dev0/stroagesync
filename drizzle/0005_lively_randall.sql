CREATE TYPE "public"."storage_item_type" AS ENUM('file', 'folder');--> statement-breakpoint
CREATE TABLE "storage_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "storage_item_type" NOT NULL,
	"owner_id" text NOT NULL,
	"parent_id" uuid,
	"storage_key" text,
	"mime_type" text,
	"size" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "storage_item_storage_key_unique" UNIQUE("storage_key"),
	CONSTRAINT "storage_item_file_metadata_check" CHECK ((
        ("storage_item"."type" = 'file'
          AND "storage_item"."storage_key" IS NOT NULL
          AND "storage_item"."mime_type" IS NOT NULL
          AND "storage_item"."size" IS NOT NULL)
        OR
        ("storage_item"."type" = 'folder'
          AND "storage_item"."storage_key" IS NULL
          AND "storage_item"."mime_type" IS NULL
          AND "storage_item"."size" IS NULL)
      ))
);
--> statement-breakpoint
INSERT INTO "storage_item" (
	"id",
	"name",
	"type",
	"owner_id",
	"parent_id",
	"created_at",
	"updated_at"
)
SELECT
	"id",
	"name",
	'folder'::"storage_item_type",
	"owner_id",
	"parent_id",
	"created_at",
	"updated_at"
FROM "folder";
--> statement-breakpoint
INSERT INTO "storage_item" (
	"id",
	"name",
	"type",
	"owner_id",
	"parent_id",
	"storage_key",
	"mime_type",
	"size",
	"created_at",
	"updated_at"
)
SELECT
	"id",
	"name",
	'file'::"storage_item_type",
	"owner_id",
	"parent_id",
	"storage_key",
	"mime_type",
	"size",
	"created_at",
	"updated_at"
FROM "file";
--> statement-breakpoint
DROP TABLE "file" CASCADE;--> statement-breakpoint
DROP TABLE "folder" CASCADE;--> statement-breakpoint
ALTER TABLE "storage_item" ADD CONSTRAINT "storage_item_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_item" ADD CONSTRAINT "storage_item_parent_id_storage_item_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."storage_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "storage_item_owner_parent_idx" ON "storage_item" USING btree ("owner_id","parent_id");
