import "server-only"
import * as dbSchema from "@/lib/db/schema"

import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { cache } from "react"
import { env } from "cloudflare:workers"

export const getDbAsync = cache(async () => {
  const connectionString = env.HIPERDRIVE.connectionString

  if (!connectionString) {
    throw new Error("Missing environment variable: DATABASE_URL")
  }

  const pool = new Pool({
    connectionString,
    max: 1,
  })

  return drizzle({ client: pool, schema: dbSchema })
})
