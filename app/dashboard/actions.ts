"use server"

import { z } from "zod"
import {
  createFolderInputSchema,
  createUploadUrlsInputSchema,
  completeUploadsInputSchema,
  renameStorageItemInputSchema,
  updateStorageItemTrashInputSchema,
} from "@/lib/validation/storage"
import { requireSession } from "@/lib/server/session"
import { revalidatePath } from "next/cache"
import { AppError } from "@/lib/server/app-error"
import { serializeStorageItem, serializeStorageItems } from "./data"
import {
  createFolder,
  createPresignedUploads,
  completePendingUploads,
  renameStorageItemById,
  updateStorageItemTrashById,
  deleteTrashedStorageItemById,
  deleteAllTrashedStorageItems,
} from "@/lib/server/storage"

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
    if (error instanceof z.ZodError)
      return { error: error.issues[0]?.message ?? "Invalid input." }
    if (error instanceof AppError) return { error: error.message }
    throw error
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
    if (error instanceof z.ZodError)
      return { error: error.issues[0]?.message ?? "Invalid input." }
    if (error instanceof AppError) return { error: error.message }
    throw error
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
    if (error instanceof z.ZodError)
      return { error: error.issues[0]?.message ?? "Invalid input." }
    if (error instanceof AppError) return { error: error.message }
    throw error
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
    if (error instanceof z.ZodError)
      return { error: error.issues[0]?.message ?? "Invalid input." }
    if (error instanceof AppError) return { error: error.message }
    throw error
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
    if (error instanceof z.ZodError)
      return { error: error.issues[0]?.message ?? "Invalid input." }
    if (error instanceof AppError) return { error: error.message }
    throw error
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
    if (error instanceof z.ZodError)
      return { error: error.issues[0]?.message ?? "Invalid input." }
    if (error instanceof AppError) return { error: error.message }
    throw error
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
    if (error instanceof z.ZodError)
      return { error: error.issues[0]?.message ?? "Invalid input." }
    if (error instanceof AppError) return { error: error.message }
    throw error
  }
}
