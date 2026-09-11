import { z } from "zod"

export const MAX_UPLOAD_FILES = 3
export const MAX_UPLOAD_FILE_SIZE = 16 * 1024 * 1024

export const createFolderInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a folder name.")
    .max(255, "Folder name must be 255 characters or fewer."),
  parentId: z.uuid().nullable(),
})

export const folderSchema = z.object({
  id: z.uuid(),
  name: z.string(),
})

const uploadFileMetadataSchema = z.object({
  name: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(255),
  size: z.number().int().nonnegative().max(MAX_UPLOAD_FILE_SIZE),
})

export const createUploadUrlsInputSchema = z.object({
  files: z
    .array(uploadFileMetadataSchema)
    .min(1, "Select at least one file.")
    .max(MAX_UPLOAD_FILES, `You can upload up to ${MAX_UPLOAD_FILES} files.`),
})

export const presignedUploadSchema = z.object({
  id: z.uuid(),
  uploadUrl: z.url(),
  mimeType: z.string().min(1),
})

export const presignedUploadsSchema = z.array(presignedUploadSchema)

export const completeUploadsInputSchema = z.object({
  fileIds: z
    .array(z.uuid())
    .min(1)
    .max(MAX_UPLOAD_FILES)
    .refine((fileIds) => new Set(fileIds).size === fileIds.length, {
      message: "File IDs must be unique.",
    }),
})

const storageItemBaseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  parentId: z.uuid().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const storageItemSchema = z.discriminatedUnion("type", [
  storageItemBaseSchema.extend({
    type: z.literal("folder"),
    mimeType: z.null(),
    size: z.null(),
  }),
  storageItemBaseSchema.extend({
    type: z.literal("file"),
    mimeType: z.string().min(1),
    size: z.number().int().nonnegative(),
  }),
])

export const storageItemsSchema = z.array(storageItemSchema)

export const filePreviewSchema = z.object({
  url: z.url(),
  mimeType: z.string().min(1),
})

export const fileDownloadSchema = z.object({
  url: z.url(),
})

export type CreateFolderInput = z.infer<typeof createFolderInputSchema>
export type CreateUploadUrlsInput = z.infer<typeof createUploadUrlsInputSchema>
export type FileDownload = z.infer<typeof fileDownloadSchema>
export type FilePreview = z.infer<typeof filePreviewSchema>
export type Folder = z.infer<typeof folderSchema>
export type PresignedUpload = z.infer<typeof presignedUploadSchema>
export type StorageItem = z.infer<typeof storageItemSchema>
