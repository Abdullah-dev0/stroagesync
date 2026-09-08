import { Router, type Router as ExpressRouter } from "express"
import { getUserSession } from "../users/user.controller"

export const folderRouter: ExpressRouter = Router()

folderRouter.get("/folder", getUserSession)
