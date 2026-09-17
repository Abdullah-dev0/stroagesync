"use server"

import { z } from "zod"
import {
  createFolderInputSchema,
  createUploadUrlsInputSchema,
  completeUploadsInputSchema,
  renameStorageItemInputSchema,
  updateStorageItemTrashInputSchema,
} from "@/lib/validations/storage"
import { requireSession } from "@/lib/auth/session"
import { revalidatePath } from "next/cache"
import {
  serializeStorageItem,
  serializeStorageItems,
  createFolder,
  createPresignedUploads,
  completePendingUploads,
  renameStorageItemById,
  updateStorageItemTrashById,
  deleteTrashedStorageItemById,
  deleteAllTrashedStorageItems,
  listStorageItemsByOwnerId,
  listTrashStorageItemsByOwnerId,
  getStorageUsageByOwnerId,
  createFilePreview,
  createFileDownload,
} from "@/lib/db/queries/storage"

function getErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Invalid input."
  }
  if (error instanceof Error) {
    return error.message
  }
  return "An unexpected error occurred."
}

// --- Read actions ---

export async function getDriveItemsAction() {
  const session = await requireSession()
  return serializeStorageItems(await listStorageItemsByOwnerId(session.user.id))
}

export async function getTrashItemsAction() {
  const session = await requireSession()
  return serializeStorageItems(
    await listTrashStorageItemsByOwnerId(session.user.id)
  )
}

export async function getStorageUsageAction() {
  const session = await requireSession()
  return getStorageUsageByOwnerId(session.user.id)
}

export async function getFilePreviewAction(itemId: unknown) {
  const session = await requireSession()
  try {
    const id = z.uuid().parse(itemId)
    return { data: await createFilePreview(id, session.user.id) }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}

export async function getFileDownloadAction(itemId: unknown) {
  const session = await requireSession()
  try {
    const id = z.uuid().parse(itemId)
    return { data: await createFileDownload(id, session.user.id) }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}

// --- Write actions ---

export async function createFolderAction(input: unknown) {
  const session = await requireSession()
  try {
    const data = createFolderInputSchema.parse(input)
    const result = serializeStorageItem(
      await createFolder(data.name, session.user.id, data.parentId)
    )
    revalidatePath("/dashboard", "layout")
    return { data: result }
  } catch (error) {
    return { error: getErrorMessage(error) }
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
    return { error: getErrorMessage(error) }
  }
}

export async function completeUploadsAction(input: unknown) {
  const session = await requireSession()
  try {
    const data = completeUploadsInputSchema.parse(input)
    const result = serializeStorageItems(
      await completePendingUploads(data.fileIds, session.user.id)
    )
    revalidatePath("/dashboard", "layout")
    return { data: result }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}

export async function renameStorageItemAction(itemId: unknown, input: unknown) {
  const session = await requireSession()
  try {
    const id = z.uuid().parse(itemId)
    const data = renameStorageItemInputSchema.parse(input)
    const result = serializeStorageItem(
      await renameStorageItemById(id, data.name, session.user.id)
    )
    revalidatePath("/dashboard", "layout")
    return { data: result }
  } catch (error) {
    return { error: getErrorMessage(error) }
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
    const result = serializeStorageItem(
      await updateStorageItemTrashById(id, session.user.id, data.trashed)
    )
    revalidatePath("/dashboard", "layout")
    return { data: result }
  } catch (error) {
    return { error: getErrorMessage(error) }
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
    return { error: getErrorMessage(error) }
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
    return { error: getErrorMessage(error) }
  }
}
