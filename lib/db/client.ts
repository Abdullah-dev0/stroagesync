import "server-only"
import * as dbSchema from "@/lib/db/schema"

import { getCloudflareContext } from "@opennextjs/cloudflare"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { cache } from "react"

export const getDbAsync = cache(async () => {
  const { env } = await getCloudflareContext({ async: true })
  const connectionString = env.HYPERDRIVE.connectionString
  const pool = new Pool({
    connectionString,
    maxUses: 1,
  })
  return drizzle({ client: pool, schema: dbSchema })
})
