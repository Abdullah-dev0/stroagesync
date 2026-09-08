import { db } from "../../db/client"
import { storageItem } from "../../db/schema"
import { AppError } from "../../lib/app-error"

export const createFolder = async (
  name: string,
  ownerId: string,
  parentId: string | null
) => {
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
