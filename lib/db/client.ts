import "server-only"
import * as dbSchema from "@/lib/db/schema"

import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { cache } from "react"

export const getDbAsync = cache(async () => {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("Missing environment variable: DATABASE_URL")
  }

  const pool = new Pool({
    connectionString,
    max: 1,
  })

  return drizzle({ client: pool, schema: dbSchema })
})
