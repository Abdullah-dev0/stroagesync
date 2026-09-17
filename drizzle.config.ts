import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env.local", quiet: true })

const databaseUrl = process.env.DATABASE_URL?.trim()
if (!databaseUrl) throw new Error("Missing environment variable: DATABASE_URL")

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: databaseUrl,
  },
})
