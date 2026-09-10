import { createFolderInputSchema } from "@workspace/validation/storage"
import { AppError } from "../../lib/app-error"
import type { AuthenticatedHandler } from "../../middleware/auth.middleware"
import {
  createFolder as createFolderRecord,
  deleteStorageItemById,
  listStorageItemsByOwnerId,
  saveFileToStorage,
} from "./storage.service"

export const createFolder: AuthenticatedHandler = async (req, res) => {
  const validation = createFolderInputSchema.safeParse(req.body)

  if (!validation.success) {
    res.status(400).json({
      message: validation.error.issues[0]?.message ?? "Invalid input.",
      code: "INVALID_FOLDER_INPUT",
    })
    return
  }

  const newFolder = await createFolderRecord(
    validation.data.name,
    res.locals.auth.user.id,
    validation.data.parentId
  )

  res.status(201).json(newFolder)
}

export const getStorageItems: AuthenticatedHandler = async (_req, res) => {
  const storageItems = await listStorageItemsByOwnerId(res.locals.auth.user.id)

  res.status(200).json(storageItems)
}

export const deleteStorageItem: AuthenticatedHandler = async (req, res) => {
  const { itemId } = req.params

  if (!itemId) {
    throw new AppError("Item ID is required.", 400, "ITEM_ID_REQUIRED")
  }

  await deleteStorageItemById(itemId, res.locals.auth.user.id)
  res
    .status(200)
    .json({ message: `Storage item ${itemId} deleted successfully.` })
}

export const uploadFile: AuthenticatedHandler = async (req, res) => {
  if (!Array.isArray(req.files) || req.files.length === 0) {
    throw new AppError("No files uploaded.", 400, "NO_FILES_UPLOADED")
  }

  console.log(
    "Files received:",
    req.files.map((file) => file)
  )

  const uploadedFiles = []

  for (const file of req.files) {
    if (!file.originalname || file.originalname.length > 255) {
      throw new AppError(
        "File name must be between 1 and 255 characters.",
        400,
        "INVALID_FILE_NAME"
      )
    }

    const newFile = await saveFileToStorage(file, res.locals.auth.user.id)
    uploadedFiles.push(newFile)
  }

  // res.status(201).json(uploadedFiles)
}
