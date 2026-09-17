"use server"

import { z } from "zod"
import {
  createFolderInputSchema,
  createUploadUrlsInputSchema,
  completeUploadsInputSchema,
  renameStorageItemInputSchema,
  updateStorageItemTrashInputSchema,
  type StorageItem,
} from "@/lib/validations/storage"
import { requireSession } from "@/lib/auth/session"
import { revalidatePath } from "next/cache"
import {
  createFolder,
  createPresignedUploads,
  completePendingUploads,
  renameStorageItemById,
  updateStorageItemTrashById,
  deleteTrashedStorageItemById,
  deleteAllTrashedStorageItems,
  getDriveItems,
  getTrashItems,
  getStorageUsage,
  createFilePreview,
  createFileDownload,
} from "@/lib/db/queries/storage"
import { ActionError } from "@/lib/utils/errors"

function handleActionError(error: unknown): { error: string } {
  if (error instanceof z.ZodError) {
    return { error: error.issues[0]?.message ?? "Invalid input." }
  }
  if (error instanceof ActionError) {
    return { error: error.message }
  }
  throw error
}

// --- Read actions (for client components / TanStack Query) ---

export async function getDriveItemsAction(): Promise<StorageItem[]> {
  return getDriveItems()
}

export async function getTrashItemsAction(): Promise<StorageItem[]> {
  return getTrashItems()
}

export async function getStorageUsageAction() {
  return getStorageUsage()
}

export async function getFilePreviewAction(itemId: unknown) {
  const session = await requireSession()
  try {
    const id = z.uuid().parse(itemId)
    return { data: await createFilePreview(id, session.user.id) }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function getFileDownloadAction(itemId: unknown) {
  const session = await requireSession()
  try {
    const id = z.uuid().parse(itemId)
    return { data: await createFileDownload(id, session.user.id) }
  } catch (error) {
    return handleActionError(error)
  }
}

// --- Write actions ---

export async function createFolderAction(input: unknown) {
  const session = await requireSession()
  try {
    const data = createFolderInputSchema.parse(input)
    const result = await createFolder(data, session.user.id)
    revalidatePath("/dashboard", "layout")
    return { data: result }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function createUploadUrlsAction(input: unknown) {
  const session = await requireSession()
  try {
    const data = createUploadUrlsInputSchema.parse(input)
    const result = await createPresignedUploads(data.files, session.user.id)
    revalidatePath("/dashboard", "layout")
    return { data: result }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function completeUploadsAction(input: unknown) {
  const session = await requireSession()
  try {
    const data = completeUploadsInputSchema.parse(input)
    const result = await completePendingUploads(data.fileIds, session.user.id)
    revalidatePath("/dashboard", "layout")
    return { data: result }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function renameStorageItemAction(itemId: unknown, input: unknown) {
  const session = await requireSession()
  try {
    const id = z.uuid().parse(itemId)
    const data = renameStorageItemInputSchema.parse(input)
    const result = await renameStorageItemById(id, data.name, session.user.id)
    revalidatePath("/dashboard", "layout")
    return { data: result }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function updateStorageItemTrashAction(
  itemId: unknown,
  input: unknown
) {
  const session = await requireSession()
  try {
    const id = z.uuid().parse(itemId)
    const data = updateStorageItemTrashInputSchema.parse(input)
    const result = await updateStorageItemTrashById(
      id,
      session.user.id,
      data.trashed
    )
    revalidatePath("/dashboard", "layout")
    return { data: result }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function deleteTrashedItemAction(itemId: unknown) {
  const session = await requireSession()
  try {
    const id = z.uuid().parse(itemId)
    const result = {
      deletedIds: await deleteTrashedStorageItemById(id, session.user.id),
    }
    revalidatePath("/dashboard", "layout")
    return { data: result }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function emptyTrashAction() {
  const session = await requireSession()
  try {
    const result = {
      deletedIds: await deleteAllTrashedStorageItems(session.user.id),
    }
    revalidatePath("/dashboard", "layout")
    return { data: result }
  } catch (error) {
    return handleActionError(error)
  }
}
