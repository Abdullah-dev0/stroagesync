import {
  completeUploadsInputSchema,
  createFolderInputSchema,
  createUploadUrlsInputSchema,
  renameStorageItemInputSchema,
} from "@workspace/validation/storage"
import { AppError } from "../../lib/app-error"
import type { AuthenticatedHandler } from "../../middleware/auth.middleware"
import {
  completePendingUploads,
  createFileDownload,
  createFilePreview,
  createFolder as createFolderRecord,
  createPresignedUploads,
  deleteStorageItemById,
  listStorageItemsByOwnerId,
  renameStorageItemById,
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

export const createUploadUrls: AuthenticatedHandler = async (req, res) => {
  const validation = createUploadUrlsInputSchema.safeParse(req.body)

  if (!validation.success) {
    throw new AppError(
      validation.error.issues[0]?.message ?? "Invalid upload.",
      400,
      "INVALID_UPLOAD_INPUT"
    )
  }

  const uploads = await createPresignedUploads(
    validation.data.files,
    res.locals.auth.user.id
  )

  res.status(201).json(uploads)
}

export const completeUploads: AuthenticatedHandler = async (req, res) => {
  const validation = completeUploadsInputSchema.safeParse(req.body)

  if (!validation.success) {
    throw new AppError(
      validation.error.issues[0]?.message ?? "Invalid upload completion.",
      400,
      "INVALID_UPLOAD_COMPLETION"
    )
  }

  const uploadedFiles = await completePendingUploads(
    validation.data.fileIds,
    res.locals.auth.user.id
  )

  res.status(200).json(uploadedFiles)
}

export const getFilePreview: AuthenticatedHandler = async (req, res) => {
  const { itemId } = req.params

  if (!itemId) {
    throw new AppError("Item ID is required.", 400, "ITEM_ID_REQUIRED")
  }

  const preview = await createFilePreview(itemId, res.locals.auth.user.id)

  res.status(200).json(preview)
}

export const getFileDownload: AuthenticatedHandler = async (req, res) => {
  const { itemId } = req.params

  if (!itemId) {
    throw new AppError("Item ID is required.", 400, "ITEM_ID_REQUIRED")
  }

  const download = await createFileDownload(itemId, res.locals.auth.user.id)

  res.status(200).json(download)
}

export const renameStorageItem: AuthenticatedHandler = async (req, res) => {
  const { itemId } = req.params

  if (!itemId) {
    throw new AppError("Item ID is required.", 400, "ITEM_ID_REQUIRED")
  }

  const validation = renameStorageItemInputSchema.safeParse(req.body)

  if (!validation.success) {
    throw new AppError(
      validation.error.issues[0]?.message ?? "Invalid name.",
      400,
      "INVALID_RENAME_INPUT"
    )
  }

  const renamedItem = await renameStorageItemById(
    itemId,
    validation.data.name,
    res.locals.auth.user.id
  )

  res.status(200).json(renamedItem)
}
