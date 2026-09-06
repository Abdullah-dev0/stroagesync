import { Router, type Router as ExpressRouter } from "express"

export const healthRouter: ExpressRouter = Router()

healthRouter.get("/", (_request, response) => {
  response.json({ message: "StorageSync API is running" })
})

healthRouter.get("/health", async (_request, response) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate a delay
  response.json({ status: "ok" })
})
