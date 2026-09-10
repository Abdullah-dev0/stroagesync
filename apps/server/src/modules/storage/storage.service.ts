import { createFolderInputSchema } from "@workspace/validation/storage"
import { and, desc, eq } from "drizzle-orm"
import { db } from "../../db/client"
import { storageItem } from "../../db/schema"
import { AppError } from "../../lib/app-error"
import { r2Client } from "../../lib/r2"
import { randomUUID } from "crypto"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { env } from "../../config/env"

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

export const saveFilesToStorage = async (
  files: Express.Multer.File[],
  ownerId: string
) => {
  const fileRecords = await Promise.all(
    files.map(async (file) => {
      const fileId = randomUUID()
      const storageKey = `users/${ownerId}/objects/${fileId}`

      await r2Client.send(
        new PutObjectCommand({
          Bucket: env.r2BucketName,
          Key: storageKey,
          Body: file.buffer,
          ContentLength: file.size,
          ContentType: file.mimetype,
        })
      )

      return {
        name: file.originalname,
        type: "file" as const,
        ownerId,
        parentId: null,
        storageKey,
        mimeType: file.mimetype,
        size: file.size,
      }
    })
  )

  const insertedFiles = await db
    .insert(storageItem)
    .values(fileRecords)
    .returning()

  return insertedFiles
}
