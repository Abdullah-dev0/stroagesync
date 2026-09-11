import { Router, type Router as ExpressRouter } from "express"
import {
  completeUploads,
  createFolder,
  createUploadUrls,
  deleteStorageItem,
  getFileDownload,
  getFilePreview,
  getStorageItems,
  renameStorageItem,
} from "./storage.controller"

export const storageRouter: ExpressRouter = Router()

storageRouter.post("/folders", createFolder)
storageRouter.post("/uploads/presign", createUploadUrls)
storageRouter.post("/uploads/complete", completeUploads)
storageRouter.get("/items", getStorageItems)
storageRouter.delete("/items/:itemId", deleteStorageItem)
storageRouter.get("/items/:itemId/preview", getFilePreview)
storageRouter.get("/items/:itemId/download", getFileDownload)
storageRouter.patch("/items/:itemId", renameStorageItem)
