import cors from "cors"
import express, { type Express } from "express"
import helmet from "helmet"
import { toNodeHandler } from "better-auth/node"
import { env } from "./config/env"
import { errorHandler } from "./middleware/error.middleware"
import { auth } from "./modules/auth/auth"
import { userRouter } from "./modules/users/user.routes"
import { healthRouter } from "./routes/health.routes"
import morgan from "morgan"

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

app.use("/api/users", userRouter)
app.use(healthRouter)

app.use(errorHandler)
