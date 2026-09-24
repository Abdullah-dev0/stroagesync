import { z } from "zod"

export const MAX_UPLOAD_FILES = 3
export const MAX_UPLOAD_FILE_SIZE = 1024 ** 3

const storageItemNameSchema = z
  .string()
  .trim()
  .min(1, "Enter a name.")
  .max(255, "Name must be 255 characters or fewer.")

export const createFolderInputSchema = z.object({
  name: storageItemNameSchema,
  parentId: z.uuid().nullable(),
})

export const storageItemIdSchema = z.uuid()

export const renameStorageItemInputSchema = createFolderInputSchema.pick({
  name: true,
})

export const updateStorageItemTrashInputSchema = z.object({
  trashed: z.boolean(),
})

export const folderSchema = z.object({
  id: z.uuid(),
  name: z.string(),
})

const uploadFileMetadataSchema = z.object({
  name: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(255),
  size: z
    .number()
    .int()
    .nonnegative()
    .max(MAX_UPLOAD_FILE_SIZE, "Each file must be 1 GB or smaller."),
})

export const createUploadUrlsInputSchema = z.object({
  files: z
    .array(uploadFileMetadataSchema)
    .min(1, "Select at least one file.")
    .max(MAX_UPLOAD_FILES, `You can upload up to ${MAX_UPLOAD_FILES} files.`),
})

export const completeUploadsInputSchema = z.object({
  fileIds: z
    .array(z.uuid())
    .min(1)
    .max(MAX_UPLOAD_FILES)
    .refine((fileIds) => new Set(fileIds).size === fileIds.length, {
      message: "File IDs must be unique.",
    }),
})

export const storageItemSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: z.enum(["folder", "file"]),
  parentId: z.uuid().nullable(),
  mimeType: z.string().nullable(),
  size: z.number().int().nonnegative().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const storageItemsResponseSchema = z.array(
  storageItemSchema.extend({
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
)

export const storageUsageSchema = z.object({
  usedBytes: z.number().int().nonnegative(),
})

export const filePreviewSchema = z.object({
  url: z.url(),
  mimeType: z.string().min(1),
})

export const folderDetailsResponseSchema = z.object({
  folder: folderSchema,
  ancestors: z.array(folderSchema),
})

export type CreateFolderInput = z.infer<typeof createFolderInputSchema>
export type CreateUploadUrlsInput = z.infer<typeof createUploadUrlsInputSchema>
export type FilePreview = z.infer<typeof filePreviewSchema>
export type Folder = z.infer<typeof folderSchema>
export type FolderDetailsResponse = z.infer<typeof folderDetailsResponseSchema>
export type RenameStorageItemInput = z.infer<
  typeof renameStorageItemInputSchema
>
export type StorageItem = z.infer<typeof storageItemSchema>
export type StorageUsage = z.infer<typeof storageUsageSchema>
export type UpdateStorageItemTrashInput = z.infer<
  typeof updateStorageItemTrashInputSchema
>
