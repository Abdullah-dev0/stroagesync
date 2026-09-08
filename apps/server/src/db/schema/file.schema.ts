import { bigint, index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "./auth.schema"
import { folder } from "./folder.schema"

export const file = pgTable(
  "file",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    storageKey: text("storage_key").notNull().unique(),
    mimeType: text("mime_type").notNull(),
    size: bigint("size", { mode: "number" }).notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    parentId: text("parent_id").references(() => folder.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("file_owner_parent_idx").on(table.ownerId, table.parentId),
  ]
)
