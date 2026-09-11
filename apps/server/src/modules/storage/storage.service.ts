import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {
  createFolderInputSchema,
  type CreateUploadUrlsInput,
  type PresignedUpload,
} from "@workspace/validation/storage"
import { randomUUID } from "crypto"
import { and, desc, eq, inArray } from "drizzle-orm"
import { env } from "../../config/env"
import { db } from "../../db/client"
import { storageItem } from "../../db/schema"
import { AppError } from "../../lib/app-error"
import { r2Client } from "../../lib/r2"

const UPLOAD_URL_EXPIRES_IN_SECONDS = 5 * 60
const PREVIEW_URL_EXPIRES_IN_SECONDS = 60
const DOWNLOAD_URL_EXPIRES_IN_SECONDS = 60

const previewableMimeTypes = new Set([
  "application/pdf",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
])

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
  return db
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
    .where(
      and(eq(storageItem.ownerId, ownerId), eq(storageItem.status, "ready"))
    )
    .orderBy(desc(storageItem.updatedAt))
}

export const deleteStorageItemById = async (
  itemId: string,
  ownerId: string
) => {
  const [deletedItem] = await db
    .delete(storageItem)
    .where(and(eq(storageItem.id, itemId), eq(storageItem.ownerId, ownerId)))
    .returning({ id: storageItem.id, key: storageItem.storageKey })

  if (!deletedItem) {
    throw new AppError("Storage item not found.", 404, "STORAGE_ITEM_NOT_FOUND")
  }

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: env.r2BucketName,
      Key: deletedItem.key!,
    })
  )

  return deletedItem
}

export const createPresignedUploads = async (
  files: CreateUploadUrlsInput["files"],
  ownerId: string
): Promise<PresignedUpload[]> => {
  const uploads = await Promise.all(
    files.map(async (file) => {
      const fileId = randomUUID()
      const storageKey = `users/${ownerId}/objects/${fileId}`
      const uploadUrl = await getSignedUrl(
        r2Client,
        new PutObjectCommand({
          Bucket: env.r2BucketName,
          Key: storageKey,
          ContentLength: file.size,
          ContentType: file.mimeType,
        }),
        { expiresIn: UPLOAD_URL_EXPIRES_IN_SECONDS }
      )

      return {
        record: {
          id: fileId,
          name: file.name,
          type: "file" as const,
          status: "pending" as const,
          ownerId,
          parentId: null,
          storageKey,
          mimeType: file.mimeType,
          size: file.size,
        },
        response: {
          id: fileId,
          uploadUrl,
          mimeType: file.mimeType,
        },
      }
    })
  )

  await db.insert(storageItem).values(uploads.map(({ record }) => record))

  return uploads.map(({ response }) => response)
}

export const completePendingUploads = async (
  fileIds: string[],
  ownerId: string
) => {
  const files = await db
    .select({
      id: storageItem.id,
      storageKey: storageItem.storageKey,
      mimeType: storageItem.mimeType,
      size: storageItem.size,
    })
    .from(storageItem)
    .where(
      and(
        eq(storageItem.ownerId, ownerId),
        eq(storageItem.type, "file"),
        inArray(storageItem.status, ["pending", "ready"]),
        inArray(storageItem.id, fileIds)
      )
    )

  if (files.length !== fileIds.length) {
    throw new AppError("Upload not found.", 404, "UPLOAD_NOT_FOUND")
  }

  await Promise.all(
    files.map(async (file) => {
      if (!file.storageKey || !file.mimeType || file.size === null) {
        throw new AppError(
          "Upload metadata is incomplete.",
          500,
          "INVALID_UPLOAD_METADATA"
        )
      }

      const object = await r2Client.send(
        new HeadObjectCommand({
          Bucket: env.r2BucketName,
          Key: file.storageKey,
        })
      )

      if (
        object.ContentLength !== file.size ||
        object.ContentType !== file.mimeType
      ) {
        throw new AppError(
          "Uploaded file does not match the expected metadata.",
          400,
          "UPLOAD_VERIFICATION_FAILED"
        )
      }
    })
  )

  const completedFiles = await db
    .update(storageItem)
    .set({ status: "ready", updatedAt: new Date() })
    .where(
      and(
        eq(storageItem.ownerId, ownerId),
        inArray(storageItem.id, fileIds),
        inArray(storageItem.status, ["pending", "ready"])
      )
    )
    .returning({
      id: storageItem.id,
      name: storageItem.name,
      type: storageItem.type,
      parentId: storageItem.parentId,
      mimeType: storageItem.mimeType,
      size: storageItem.size,
      createdAt: storageItem.createdAt,
      updatedAt: storageItem.updatedAt,
    })

  if (completedFiles.length !== fileIds.length) {
    throw new AppError(
      "Upload expired before completion.",
      409,
      "UPLOAD_EXPIRED"
    )
  }

  return completedFiles
}

export const createFilePreview = async (itemId: string, ownerId: string) => {
  const [file] = await db
    .select({
      storageKey: storageItem.storageKey,
      mimeType: storageItem.mimeType,
    })
    .from(storageItem)
    .where(
      and(
        eq(storageItem.id, itemId),
        eq(storageItem.ownerId, ownerId),
        eq(storageItem.type, "file"),
        eq(storageItem.status, "ready")
      )
    )
    .limit(1)

  if (!file?.storageKey || !file.mimeType) {
    throw new AppError("File not found.", 404, "FILE_NOT_FOUND")
  }

  if (!previewableMimeTypes.has(file.mimeType)) {
    throw new AppError(
      "This file type cannot be previewed.",
      415,
      "PREVIEW_NOT_SUPPORTED"
    )
  }

  const url = await getSignedUrl(
    r2Client,
    new GetObjectCommand({
      Bucket: env.r2BucketName,
      Key: file.storageKey,
      ResponseContentType: file.mimeType,
      ResponseContentDisposition: "inline",
    }),
    { expiresIn: PREVIEW_URL_EXPIRES_IN_SECONDS }
  )

  return {
    url,
    mimeType: file.mimeType,
  }
}

export const createFileDownload = async (itemId: string, ownerId: string) => {
  const [file] = await db
    .select({
      name: storageItem.name,
      storageKey: storageItem.storageKey,
    })
    .from(storageItem)
    .where(
      and(
        eq(storageItem.id, itemId),
        eq(storageItem.ownerId, ownerId),
        eq(storageItem.type, "file"),
        eq(storageItem.status, "ready")
      )
    )
    .limit(1)

  if (!file?.storageKey) {
    throw new AppError("File not found.", 404, "FILE_NOT_FOUND")
  }

  const url = await getSignedUrl(
    r2Client,
    new GetObjectCommand({
      Bucket: env.r2BucketName,
      Key: file.storageKey,
      ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
    }),
    { expiresIn: DOWNLOAD_URL_EXPIRES_IN_SECONDS }
  )

  return { url }
}
