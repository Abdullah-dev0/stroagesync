import cors from "cors"
import express, { type Express } from "express"
import helmet from "helmet"
import morgan from "morgan"
import { toNodeHandler } from "better-auth/node"
import { env } from "./config/env"
import { requireAuth } from "./middleware/auth.middleware"
import { errorHandler } from "./middleware/error.middleware"
import { auth } from "./modules/auth/auth"
import { folderRouter } from "./modules/folders/folder.routes"
import { userRouter } from "./modules/users/user.routes"
import { healthRouter } from "./routes/health.routes"

export const app: Express = express()

app.use(helmet())
app.use(morgan("dev"))
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
)

app.all("/api/auth/*splat", toNodeHandler(auth))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/users", requireAuth, userRouter)
app.use("/api/folders", requireAuth, folderRouter)
app.use(healthRouter)

app.use(errorHandler)
