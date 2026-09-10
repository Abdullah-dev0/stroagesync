import {
  type AnyPgColumn,
  bigint,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { user } from "./auth.schema"

export const storageItemType = pgEnum("storage_item_type", ["file", "folder"])
export const storageItemStatus = pgEnum("storage_item_status", [
  "pending",
  "ready",
  "cleanup_pending",
])

export const storageItem = pgTable(
  "storage_item",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    type: storageItemType("type").notNull(),
    status: storageItemStatus("status").default("ready").notNull(),

    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    parentId: uuid("parent_id").references((): AnyPgColumn => storageItem.id, {
      onDelete: "cascade",
    }),

    storageKey: text("storage_key").unique(),
    mimeType: text("mime_type"),
    size: bigint("size", { mode: "number" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("storage_item_owner_parent_idx").on(table.ownerId, table.parentId),
  ]
)
