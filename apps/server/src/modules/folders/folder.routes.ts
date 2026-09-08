import { Router, type Router as ExpressRouter } from "express"
import { createFolder } from "./folder.controller"

export const folderRouter: ExpressRouter = Router()

folderRouter.post("/", createFolder)
