import { config } from "dotenv"

config({ path: ".env.local", quiet: true })

export const env = {
  port: Number(process.env.PORT),
  clientOrigin: process.env.CLIENT_ORIGIN,
  databaseUrl: process.env.DATABASE_URL,
  betterAuthUrl: process.env.BETTER_AUTH_URL,
  uploadDir: process.env.UPLOAD_DIR,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  r2Endpoint: process.env.R2_ENDPOINT,
}

for (const [key, value] of Object.entries(env)) {
  if (!value) throw new Error(`Missing environment variable: ${key}`)
}
