import { Router, type Router as ExpressRouter } from "express"
import { changeCurrentUserName, getUserSession } from "./user.controller"

export const userRouter: ExpressRouter = Router()

userRouter.get("/session", getUserSession)
userRouter.patch("/me/name", changeCurrentUserName)
