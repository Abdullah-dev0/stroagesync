import "server-only"

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { env } from "@/lib/env"
import { db } from "@/lib/db/client"
import * as schema from "@/lib/db/schema/auth.schema"
import { nextCookies } from "better-auth/next-js"

export const auth = betterAuth({
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
      maxAge: 5 * 60,
    },
  },
  plugins: [nextCookies()],
  baseURL: env.betterAuthUrl,
  trustedOrigins: [env.betterAuthUrl],
})
