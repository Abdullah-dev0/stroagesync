import { randomUUID } from "node:crypto"
import { db } from "../../db/client"
import { folder } from "../../db/schema"
import { AppError } from "../../lib/app-error"

export const createFolder = async (name: string, ownerId: string) => {
  const [newFolder] = await db
    .insert(folder)
    .values({
      id: randomUUID(),
      name: name.trim(),
      ownerId,
    })
    .returning({
      id: folder.id,
      name: folder.name,
    })

  if (!newFolder) {
    throw new AppError("Failed to create folder", 500, "FOLDER_CREATE_FAILED")
  }

  return newFolder
}
