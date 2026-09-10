import { createFolderInputSchema } from "@workspace/validation/storage"
import { and, desc, eq } from "drizzle-orm"
import { db } from "../../db/client"
import { storageItem } from "../../db/schema"
import { AppError } from "../../lib/app-error"
import { env } from "../../config/env"
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3"

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
) => {
  try {
    const value = new PutObjectCommand({
      Bucket: env.uploadDir,
      Key: env.secretAccessKey,
      Body: file.buffer,
      ContentLength: file.size,
      ContentType: file.mimetype || "application/octet-stream",
      IfNoneMatch: "*",
    })

    const [insertedFiles] = await db.insert(storageItem).values().returning()
  } catch (error) {
    if (error instanceof S3) {
      // await db.delete.from(storageItem)
    }
  }
}
