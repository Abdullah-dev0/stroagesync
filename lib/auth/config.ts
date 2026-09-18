import "server-only"

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { cache } from "react"
import { env } from "@/lib/env"
import { getDbAsync } from "@/lib/db/client"
import * as schema from "@/lib/db/schema/auth.schema"

export const getAuth = cache(async () => {
  const db = await getDbAsync()

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
    },
    advanced: {
      cookiePrefix: "auth-token",
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 3 * 60,
      },
    },
    baseURL: env.betterAuthUrl,
    trustedOrigins: [env.betterAuthUrl],
  })
})
