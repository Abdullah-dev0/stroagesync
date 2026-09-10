import { randomUUID } from "node:crypto"
import { mkdir, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import { and, desc, eq } from "drizzle-orm"
import { createFolderInputSchema } from "@workspace/validation/storage"
import { env } from "../../config/env"
import { db } from "../../db/client"
import { storageItem } from "../../db/schema"
import { AppError } from "../../lib/app-error"

export const createFolder = async (
  name: string,
  ownerId: string,
  parentId: string | null
) => {
  const validation = createFolderInputSchema.safeParse({ name, parentId })

  if (!validation.success) {
    throw new AppError(validation.error.message, 400, "INVALID_FOLDER_INPUT")
  }

  const [newFolder] = await db
    .insert(storageItem)
    .values({
      name: name.trim(),
      type: "folder",
      ownerId,
      parentId,
    })
    .returning({
      id: storageItem.id,
      name: storageItem.name,
    })

  if (!newFolder) {
    throw new AppError("Failed to create folder", 500, "FOLDER_CREATE_FAILED")
  }

  return newFolder
}

export const listStorageItemsByOwnerId = async (ownerId: string) => {
  const storageItems = await db
    .select({
      id: storageItem.id,
      name: storageItem.name,
      type: storageItem.type,
      parentId: storageItem.parentId,
      mimeType: storageItem.mimeType,
      size: storageItem.size,
      createdAt: storageItem.createdAt,
      updatedAt: storageItem.updatedAt,
    })
    .from(storageItem)
    .where(eq(storageItem.ownerId, ownerId))
    .orderBy(desc(storageItem.updatedAt))

  return storageItems
}

export const deleteStorageItemById = async (
  itemId: string,
  ownerId: string
) => {
  const [deletedItem] = await db
    .delete(storageItem)
    .where(and(eq(storageItem.id, itemId), eq(storageItem.ownerId, ownerId)))
    .returning({ id: storageItem.id })

  if (!deletedItem) {
    throw new AppError("Storage item not found.", 404, "STORAGE_ITEM_NOT_FOUND")
  }

  return deletedItem
}

export const saveFileToStorage = async (
  file: Express.Multer.File,
  ownerId: string
) => {}
