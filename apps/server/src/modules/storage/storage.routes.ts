import { Router, type Router as ExpressRouter } from "express"
import { uploadFiles } from "../../middleware/upload.middleware"
import {
  createFolder,
  deleteStorageItem,
  getStorageItems,
  uploadFile,
} from "./storage.controller"

export const storageRouter: ExpressRouter = Router()

storageRouter.post("/folders", createFolder)
storageRouter.post("/upload", uploadFiles, uploadFile)
storageRouter.get("/items", getStorageItems)
storageRouter.delete("/items/:itemId", deleteStorageItem)
