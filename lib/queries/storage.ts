import "server-only"

import { cacheTag } from "next/cache"
import { notFound } from "next/navigation"
import { z } from "zod"

import { requireSession } from "@/lib/auth/session"
import { storageTags } from "@/lib/cache/storage"
import {
  getFolderAncestors,
  getFolderContentItems,
  getStorageUsageByOwnerId,
  listStorageItemsByOwnerId,
  listTrashStorageItemsByOwnerId,
} from "@/lib/db/queries/storage"

export async function getDriveItems(parentId: string | null = null) {
  const session = await requireSession()
  return getDriveItemsForOwner(session.user.id, parentId)
}

async function getDriveItemsForOwner(
  ownerId: string,
  parentId: string | null
) {
  "use cache"

  cacheTag(storageTags.items(ownerId, parentId))
  return listStorageItemsByOwnerId(ownerId, parentId)
}

export async function getTrashItems() {
  const session = await requireSession()
  return getTrashItemsForOwner(session.user.id)
}

async function getTrashItemsForOwner(ownerId: string) {
  "use cache"

  cacheTag(storageTags.trash(ownerId))
  return listTrashStorageItemsByOwnerId(ownerId)
}

export async function getStorageUsage() {
  const session = await requireSession()
  return getStorageUsageForOwner(session.user.id)
}

async function getStorageUsageForOwner(ownerId: string) {
  "use cache"

  cacheTag(storageTags.usage(ownerId))
  return getStorageUsageByOwnerId(ownerId)
}

export async function getFolderDetails(id: string) {
  const parsedId = z.uuid().safeParse(id)
  if (!parsedId.success) {
    notFound()
  }

  const session = await requireSession()
  return getFolderDetailsForOwner(session.user.id, parsedId.data)
}

async function getFolderDetailsForOwner(ownerId: string, id: string) {
  "use cache"

  cacheTag(storageTags.folder(ownerId, id), storageTags.items(ownerId, id))

  const [folderResult, ancestors] = await Promise.all([
    getFolderContentItems(id, ownerId),
    getFolderAncestors(id, ownerId),
  ])

  if (!folderResult.success) {
    notFound()
  }

  return {
    folder: {
      id: folderResult.data.id,
      name: folderResult.data.name,
    },
    ancestors,
    children: folderResult.data.children,
  }
}
