import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { env } from "../../config/env"
import { db } from "../../db/client"
import * as schema from "../../db/schema/auth.schema"

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
    crossSubDomainCookies: env.betterAuthCookieDomain
      ? {
          enabled: true,
          domain: env.betterAuthCookieDomain,
        }
      : undefined,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  baseURL: env.betterAuthUrl,
  trustedOrigins: [env.clientOrigin],
})
