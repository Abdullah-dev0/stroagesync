import express, { type Express, type Request, type Response } from "express"
import cors from "cors"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"

const app: Express = express()
const port = Number(process.env.PORT) || 4000
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000"

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
)

app.all("/api/auth/*splat", toNodeHandler(auth))
app.use(express.json())

app.get("/", (_request: Request, response: Response) => {
  response.json({ message: "StorageSync API is running" })
})

app.get("/health", (_request: Request, response: Response) => {
  response.json({ status: "ok" })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
