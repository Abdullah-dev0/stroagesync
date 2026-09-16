import { Router, type Router as ExpressRouter } from "express"
import {
  completeUploads,
  createFolder,
  createUploadUrls,
  deleteAllTrashedItems,
  deleteTrashedItem,
  getFileDownload,
  getFilePreview,
  getStorageItems,
  getStorageUsage,
  getTrashedItems,
  renameStorageItem,
  updateStorageItemTrash,
} from "./storage.controller"

export const storageRouter: ExpressRouter = Router()

storageRouter.post("/folders", createFolder)
storageRouter.post("/uploads/presign", createUploadUrls)
storageRouter.post("/uploads/complete", completeUploads)
storageRouter.get("/items", getStorageItems)
storageRouter.get("/usage", getStorageUsage)
storageRouter.get("/items/:itemId/preview", getFilePreview)
storageRouter.get("/items/:itemId/download", getFileDownload)
storageRouter.patch("/items/:itemId", renameStorageItem)
storageRouter.patch("/items/:itemId/trash", updateStorageItemTrash)
storageRouter.get("/trash", getTrashedItems)
storageRouter.delete("/items/:itemId", deleteTrashedItem)
storageRouter.delete("/trash", deleteAllTrashedItems)
