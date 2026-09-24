import "server-only"

import { cache } from "react"

import { requireSession } from "@/lib/auth/session"
import {
  getFolderAncestors,
  getFolderById,
  listStorageItemsByOwnerId,
  listTrashStorageItemsByOwnerId,
} from "@/lib/db/queries/storage"
import {
  storageItemIdSchema,
  type FolderDetailsResponse,
  type StorageItem,
} from "@/lib/validations/storage"

/**
 * Server function to fetch drive items for the authenticated user.
 * Wrapped with React.cache() for per-request deduplication across the component tree.
 */
export const getDriveItems = cache(
  async (parentId?: string | null): Promise<StorageItem[]> => {
    const session = await requireSession()
    return listStorageItemsByOwnerId(session.user.id, parentId)
  }
)

/**
 * Server function to fetch trash items for the authenticated user.
 * Wrapped with React.cache() for per-request deduplication across the component tree.
 */
export const getTrashItems = cache(async (): Promise<StorageItem[]> => {
  const session = await requireSession()
  return listTrashStorageItemsByOwnerId(session.user.id)
})

/**
 * Server function to fetch folder details and ancestors for the authenticated user.
 * Wrapped with React.cache() for per-request deduplication across the component tree.
 */
export const getFolderDetails = cache(
  async (folderId: string): Promise<FolderDetailsResponse | null> => {
    const id = storageItemIdSchema.parse(folderId)
    const session = await requireSession()

    const [result, ancestors] = await Promise.all([
      getFolderById(id, session.user.id),
      getFolderAncestors(id, session.user.id),
    ])

    if (!result.success) {
      return null
    }

    return {
      folder: result.data,
      ancestors,
    }
  }
)
