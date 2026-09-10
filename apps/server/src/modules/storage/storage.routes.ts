import { Router, type Router as ExpressRouter } from "express"
import {
  completeUploads,
  createFolder,
  createUploadUrls,
  deleteStorageItem,
  getStorageItems,
} from "./storage.controller"

export const storageRouter: ExpressRouter = Router()

storageRouter.post("/folders", createFolder)
storageRouter.post("/uploads/presign", createUploadUrls)
storageRouter.post("/uploads/complete", completeUploads)
storageRouter.get("/items", getStorageItems)
storageRouter.delete("/items/:itemId", deleteStorageItem)
