import { Router, type Router as ExpressRouter } from "express"
import {
  createFolder,
  deleteStorageItem,
  getStorageItems,
} from "./storage.controller"

export const storageRouter: ExpressRouter = Router()

storageRouter.post("/folders", createFolder)
storageRouter.get("/items", getStorageItems)
storageRouter.delete("/items/:itemId", deleteStorageItem)
