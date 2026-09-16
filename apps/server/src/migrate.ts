import { fileURLToPath } from "node:url"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"

const databaseUrl = process.env.DATABASE_URL?.trim()

if (!databaseUrl) {
  throw new Error("Missing environment variable: DATABASE_URL")
}

const pool = new Pool({ connectionString: databaseUrl, max: 1 })
const db = drizzle({ client: pool })

const migrationsFolder = fileURLToPath(new URL("../drizzle", import.meta.url))

try {
  await migrate(db, { migrationsFolder })
  console.log("Database migrations completed")
} finally {
  await pool.end()
}
