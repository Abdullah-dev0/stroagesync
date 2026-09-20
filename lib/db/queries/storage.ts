import "server-only"

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {
  type CreateFolderInput,
  type CreateUploadUrlsInput,
} from "@/lib/validations/storage"
import { randomUUID } from "crypto"
import {
  and,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  sql,
  sum,
} from "drizzle-orm"
import { env } from "@/lib/env"
import { getDbAsync } from "@/lib/db/client"
import { storageItem } from "@/lib/db/schema"
import { r2Client } from "@/lib/db/r2"
import { ok, err } from "@/lib/utils/result"

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

// --- Query functions ---

// The caller must validate the input with createFolderInputSchema first.
export const createFolder = async (
  input: CreateFolderInput,
  ownerId: string
) => {
  const db = await getDbAsync()
  const [newFolder] = await db
    .insert(storageItem)
    .values({
      name: input.name,
      type: "folder",
      ownerId,
      parentId: input.parentId,
    })
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

  if (!newFolder) {
    throw new Error("Folder insert unexpectedly returned no row.")
  }

  return ok(newFolder)
}

export const listStorageItemsByOwnerId = async (
  ownerId: string,
  parentId?: string | null
) => {
  const db = await getDbAsync()
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
      and(
        eq(storageItem.ownerId, ownerId),
        parentId
          ? eq(storageItem.parentId, parentId)
          : isNull(storageItem.parentId),
        eq(storageItem.status, "ready"),
        isNull(storageItem.deletedAt)
      )
    )
    .orderBy(desc(storageItem.updatedAt))
}

export const getStorageUsageByOwnerId = async (ownerId: string) => {
  const db = await getDbAsync()
  const [usage] = await db
    .select({ usedBytes: sum(storageItem.size) })
    .from(storageItem)
    .where(
      and(
        eq(storageItem.ownerId, ownerId),
        eq(storageItem.type, "file"),
        eq(storageItem.status, "ready")
      )
    )

  return { usedBytes: Number(usage?.usedBytes ?? 0) }
}

export const updateStorageItemTrashById = async (
  itemId: string,
  ownerId: string,
  trashed: boolean
) => {
  const db = await getDbAsync()
  const [updatedItem] = await db
    .update(storageItem)
    .set({
      deletedAt: trashed ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(storageItem.id, itemId),
        eq(storageItem.ownerId, ownerId),
        eq(storageItem.status, "ready")
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

  if (!updatedItem) {
    return err("Storage item not found.")
  }

  return ok(updatedItem)
}

export const createPresignedUploads = async (
  files: CreateUploadUrlsInput["files"],
  ownerId: string
) => {
  const db = await getDbAsync()
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
  const db = await getDbAsync()
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
    return err("Upload not found.")
  }

  const uploadedObjects = await Promise.all(
    files.map(async (file) => {
      if (!file.storageKey || !file.mimeType || file.size === null) {
        throw new Error(`Upload ${file.id} has incomplete metadata.`)
      }

      const object = await r2Client.send(
        new HeadObjectCommand({
          Bucket: env.r2BucketName,
          Key: file.storageKey,
        })
      )

      return { file, object }
    })
  )

  const hasMetadataMismatch = uploadedObjects.some(
    ({ file, object }) =>
      object.ContentLength !== file.size || object.ContentType !== file.mimeType
  )

  if (hasMetadataMismatch) {
    return err("Uploaded file does not match the expected metadata.")
  }

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
    return err("Upload expired before completion.")
  }

  return ok(completedFiles)
}

export const createFilePreview = async (itemId: string, ownerId: string) => {
  const db = await getDbAsync()
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
    return err("File not found.")
  }

  if (!previewableMimeTypes.has(file.mimeType)) {
    return err("This file type cannot be previewed.")
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

  return ok({
    url,
    mimeType: file.mimeType,
  })
}

export const createFileDownload = async (itemId: string, ownerId: string) => {
  const db = await getDbAsync()
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
    return err("File not found.")
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

  return ok({ url })
}

export const renameStorageItemById = async (
  itemId: string,
  name: string,
  ownerId: string
) => {
  const db = await getDbAsync()
  const [renamedItem] = await db
    .update(storageItem)
    .set({ name, updatedAt: new Date() })
    .where(
      and(
        eq(storageItem.id, itemId),
        eq(storageItem.ownerId, ownerId),
        eq(storageItem.status, "ready")
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

  if (!renamedItem) {
    return err("Storage item not found.")
  }

  return ok(renamedItem)
}

export const listTrashStorageItemsByOwnerId = async (ownerId: string) => {
  const db = await getDbAsync()
  return await db
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
      and(
        eq(storageItem.ownerId, ownerId),
        eq(storageItem.status, "ready"),
        isNotNull(storageItem.deletedAt)
      )
    )
    .orderBy(desc(storageItem.updatedAt))
}

const deleteTrashedStorageItems = async (ownerId: string, itemId?: string) => {
  const db = await getDbAsync()
  const conditions = and(
    eq(storageItem.ownerId, ownerId),
    eq(storageItem.status, "ready"),
    isNotNull(storageItem.deletedAt),
    itemId ? eq(storageItem.id, itemId) : undefined
  )

  const trashedItems = await db
    .select({
      id: storageItem.id,
      storageKey: storageItem.storageKey,
    })
    .from(storageItem)
    .where(conditions)

  if (itemId && trashedItems.length === 0) {
    return err("Trashed item not found.")
  }

  await Promise.all(
    trashedItems.map((item) => {
      if (!item.storageKey) return

      return r2Client.send(
        new DeleteObjectCommand({
          Bucket: env.r2BucketName,
          Key: item.storageKey,
        })
      )
    })
  )

  const deletedItems = await db
    .delete(storageItem)
    .where(conditions)
    .returning({ id: storageItem.id })

  return ok(deletedItems.map((item) => item.id))
}

export const deleteTrashedStorageItemById = async (
  itemId: string,
  ownerId: string
) => deleteTrashedStorageItems(ownerId, itemId)

export const deleteAllTrashedStorageItems = async (ownerId: string) =>
  deleteTrashedStorageItems(ownerId)

export async function getFolderById(id: string, ownerId: string) {
  const db = await getDbAsync()

  const data = await db.query.storageItem.findFirst({
    columns: {
      id: true,
      name: true,
      parentId: true,
    },
    where: (folder, { and, eq, isNull }) =>
      and(
        eq(folder.id, id),
        eq(folder.ownerId, ownerId),
        eq(folder.type, "folder"),
        eq(folder.status, "ready"),
        isNull(folder.deletedAt)
      ),
  })

  if (!data) {
    return err("Folder not found.")
  }

  return ok(data)
}

/**
 * Returns the ordered list of ancestor folders for a given folder id,
 * from the root down to the immediate parent (excluding the folder itself).
 * Uses a recursive CTE so it works at any depth in a single round-trip.
 */
export async function getFolderAncestors(
  id: string,
  ownerId: string
): Promise<Array<{ id: string; name: string }>> {
  const db = await getDbAsync()

  // Walk parentId upward with a recursive CTE, collecting ancestors depth-first.
  // The final SELECT orders them from root down to immediate parent.
  const rows = await db.execute<{ id: string; name: string }>(sql`
    WITH RECURSIVE ancestors AS (
      SELECT si.id, si.name, si.parent_id, 1 AS depth
      FROM storage_item si
      INNER JOIN storage_item child
        ON child.parent_id = si.id
       AND child.id        = ${id}
       AND child.owner_id  = ${ownerId}
      WHERE si.type       = 'folder'
        AND si.status     = 'ready'
        AND si.deleted_at IS NULL
        AND si.owner_id   = ${ownerId}

      UNION ALL

      SELECT si.id, si.name, si.parent_id, a.depth + 1
      FROM storage_item si
      INNER JOIN ancestors a ON si.id = a.parent_id
      WHERE si.type       = 'folder'
        AND si.status     = 'ready'
        AND si.deleted_at IS NULL
        AND si.owner_id   = ${ownerId}
    )
    SELECT id, name
    FROM ancestors
    ORDER BY depth DESC
  `)

  return rows.rows
}
