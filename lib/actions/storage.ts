"use server"

import { z } from "zod"
import {
  createFolderInputSchema,
  createUploadUrlsInputSchema,
  completeUploadsInputSchema,
  renameStorageItemInputSchema,
  updateStorageItemTrashInputSchema,
  type PresignedUpload,
  type StorageItem,
} from "@/lib/validations/storage"
import { requireSession } from "@/lib/auth/session"
import {
  createFolder,
  createPresignedUploads,
  completePendingUploads,
  renameStorageItemById,
  updateStorageItemTrashById,
  deleteTrashedStorageItemById,
  deleteAllTrashedStorageItems,
  createFileDownload,
} from "@/lib/db/queries/storage"
import { type Result, ok, err } from "@/lib/utils/result"

// --- Read actions for user-triggered interactions ---

export async function getFileDownloadAction(
  itemId: unknown
): Promise<Result<{ url: string }>> {
  const session = await requireSession()
  const parsedId = z.uuid().safeParse(itemId)

  if (!parsedId.success) {
    return err("Invalid item ID.")
  }

  const result = await createFileDownload(parsedId.data, session.user.id)

  if (!result.success) {
    return err(result.error)
  }

  return ok(result.data)
}

// --- Write actions ---

export async function createFolderAction(
  input: unknown
): Promise<Result<StorageItem>> {
  const session = await requireSession()
  const parsed = createFolderInputSchema.safeParse(input)
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? "Invalid input.")
  }

  const result = await createFolder(parsed.data, session.user.id)
  if (!result.success) {
    return err(result.error)
  }

  return ok(result.data)
}

export async function createUploadUrlsAction(
  input: unknown
): Promise<Result<PresignedUpload[]>> {
  const session = await requireSession()
  const parsed = createUploadUrlsInputSchema.safeParse(input)
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? "Invalid input.")
  }

  const result = await createPresignedUploads(
    parsed.data.files,
    session.user.id
  )
  return ok(result)
}

export async function completeUploadsAction(
  input: unknown
): Promise<Result<StorageItem[]>> {
  const session = await requireSession()
  const parsed = completeUploadsInputSchema.safeParse(input)
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? "Invalid input.")
  }

  const result = await completePendingUploads(
    parsed.data.fileIds,
    session.user.id
  )
  if (!result.success) {
    return err(result.error)
  }

  return ok(result.data)
}

export async function renameStorageItemAction(
  itemId: unknown,
  input: unknown
): Promise<Result<StorageItem>> {
  const session = await requireSession()
  const parsedId = z.uuid().safeParse(itemId)
  if (!parsedId.success) {
    return err("Invalid item ID.")
  }

  const parsedInput = renameStorageItemInputSchema.safeParse(input)
  if (!parsedInput.success) {
    return err(parsedInput.error.issues[0]?.message ?? "Invalid input.")
  }

  const result = await renameStorageItemById(
    parsedId.data,
    parsedInput.data.name,
    session.user.id
  )
  if (!result.success) {
    return err(result.error)
  }

  return ok(result.data)
}

export async function updateStorageItemTrashAction(
  itemId: unknown,
  input: unknown
): Promise<Result<StorageItem>> {
  const session = await requireSession()
  const parsedId = z.uuid().safeParse(itemId)
  if (!parsedId.success) {
    return err("Invalid item ID.")
  }

  const parsedInput = updateStorageItemTrashInputSchema.safeParse(input)
  if (!parsedInput.success) {
    return err(parsedInput.error.issues[0]?.message ?? "Invalid input.")
  }

  const result = await updateStorageItemTrashById(
    parsedId.data,
    session.user.id,
    parsedInput.data.trashed
  )
  if (!result.success) {
    return err(result.error)
  }

  return ok(result.data)
}

export async function deleteTrashedItemAction(
  itemId: unknown
): Promise<Result<{ deletedIds: string[] }>> {
  const session = await requireSession()
  const parsedId = z.uuid().safeParse(itemId)
  if (!parsedId.success) {
    return err("Invalid item ID.")
  }

  const result = await deleteTrashedStorageItemById(
    parsedId.data,
    session.user.id
  )
  if (!result.success) {
    return err(result.error)
  }

  return ok({ deletedIds: result.data })
}

export async function emptyTrashAction(): Promise<
  Result<{ deletedIds: string[] }>
> {
  const session = await requireSession()
  const result = await deleteAllTrashedStorageItems(session.user.id)
  if (!result.success) {
    return err(result.error)
  }

  return ok({ deletedIds: result.data })
}
