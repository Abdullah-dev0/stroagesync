import { z } from "zod"

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

export type CreateFolderInput = z.infer<typeof createFolderInputSchema>
export type Folder = z.infer<typeof folderSchema>
export type StorageItem = z.infer<typeof storageItemSchema>
