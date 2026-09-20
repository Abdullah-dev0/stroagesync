import "server-only"

import { notFound } from "next/navigation"
import { z } from "zod"

import { requireSession } from "@/lib/auth/session"
import {
  getFolderAncestors,
  getFolderContentItems,
  getStorageUsageByOwnerId,
  listStorageItemsByOwnerId,
  listTrashStorageItemsByOwnerId,
} from "@/lib/db/queries/storage"

export async function getDriveItems(parentId?: string | null) {
  const session = await requireSession()
  return listStorageItemsByOwnerId(session.user.id, parentId)
}

export async function getTrashItems() {
  const session = await requireSession()
  return listTrashStorageItemsByOwnerId(session.user.id)
}

export async function getStorageUsage() {
  const session = await requireSession()
  return getStorageUsageByOwnerId(session.user.id)
}

export async function getFolderDetails(id: string) {
  const session = await requireSession()
  const parsedId = z.uuid().safeParse(id)

  if (!parsedId.success) {
    notFound()
  }

  const [folderResult, ancestors] = await Promise.all([
    getFolderContentItems(parsedId.data, session.user.id),
    getFolderAncestors(parsedId.data, session.user.id),
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
  }
}
