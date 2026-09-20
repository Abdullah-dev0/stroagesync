"use server"

import { requireSession } from "@/lib/auth/session"
import {
  completePendingUploads,
  createFileDownload,
  createFolder,
  createPresignedUploads,
  deleteAllTrashedStorageItems,
  deleteTrashedStorageItemById,
  renameStorageItemById,
  updateStorageItemTrashById,
} from "@/lib/db/queries/storage"
import { err, ok } from "@/lib/utils/result"
import {
  completeUploadsInputSchema,
  createFolderInputSchema,
  createUploadUrlsInputSchema,
  renameStorageItemInputSchema,
  updateStorageItemTrashInputSchema,
} from "@/lib/validations/storage"
import { z } from "zod"

// --- Read actions for user-triggered interactions ---

export async function getFileDownloadAction(itemId: unknown) {
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

export async function createFolderAction(input: unknown) {
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

export async function createUploadUrlsAction(input: unknown) {
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

export async function completeUploadsAction(input: unknown) {
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

export async function renameStorageItemAction(itemId: unknown, input: unknown) {
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
) {
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

export async function deleteTrashedItemAction(itemId: string) {
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

export async function emptyTrashAction() {
  const session = await requireSession()
  const result = await deleteAllTrashedStorageItems(session.user.id)
  if (!result.success) {
    return err(result.error)
  }

  return ok({ deletedIds: result.data })
}
