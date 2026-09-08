import { Router, type Router as ExpressRouter } from "express"
import { createFolder } from "./storage.controller"

export const storageRouter: ExpressRouter = Router()

storageRouter.post("/folders", createFolder)
stroageRouter.get("/folders",
