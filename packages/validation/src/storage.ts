import { z } from "zod"

export const createFolderInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a folder name.")
    .max(255, "Folder name must be 255 characters or fewer."),
  parentId: z.string().nullable(),
})

export const folderSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export type CreateFolderInput = z.infer<typeof createFolderInputSchema>
export type Folder = z.infer<typeof folderSchema>
