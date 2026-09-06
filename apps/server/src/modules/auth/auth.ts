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
  },
  baseURL: env.betterAuthUrl,
  trustedOrigins: [env.clientOrigin],
})
