import "server-only"
import { storageItemSchema, storageItemsSchema } from "@/lib/validation/storage"
import { requireSession } from "@/lib/server/session"
import {
  listStorageItemsByOwnerId,
  listTrashStorageItemsByOwnerId,
  getStorageUsageByOwnerId,
} from "@/lib/server/storage"

// Keep the existing JSON API shape when returning database dates through RSC/actions.
type StorageRecord = Awaited<
  ReturnType<typeof listStorageItemsByOwnerId>
>[number]

export function serializeStorageItem(item: StorageRecord) {
  return storageItemSchema.parse({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  })
}

export function serializeStorageItems(
  items: Awaited<ReturnType<typeof listStorageItemsByOwnerId>>
) {
  return storageItemsSchema.parse(
    items.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }))
  )
}

export async function getDriveItems() {
  const session = await requireSession()
  return serializeStorageItems(await listStorageItemsByOwnerId(session.user.id))
}

export async function getTrashItems() {
  const session = await requireSession()
  return serializeStorageItems(
    await listTrashStorageItemsByOwnerId(session.user.id)
  )
}

export async function getStorageUsage() {
  const session = await requireSession()
  return getStorageUsageByOwnerId(session.user.id)
}
