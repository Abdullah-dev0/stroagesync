import { Router, type Router as ExpressRouter } from "express"
import { getUserSession } from "./user.controller"

export const userRouter: ExpressRouter = Router()

userRouter.get("/session", getUserSession)
