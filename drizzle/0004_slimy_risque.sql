ALTER TABLE "file" DROP CONSTRAINT "file_parent_id_folder_id_fk";--> statement-breakpoint
ALTER TABLE "folder" DROP CONSTRAINT "folder_parent_id_folder_id_fk";--> statement-breakpoint
ALTER TABLE "file" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "file" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "file" ALTER COLUMN "parent_id" SET DATA TYPE uuid USING "parent_id"::uuid;--> statement-breakpoint
ALTER TABLE "folder" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "folder" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "folder" ALTER COLUMN "parent_id" SET DATA TYPE uuid USING "parent_id"::uuid;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_parent_id_folder_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder" ADD CONSTRAINT "folder_parent_id_folder_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;
