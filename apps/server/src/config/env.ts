import { config } from "dotenv"

config({ path: ".env.local", quiet: true })

function requireEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }

  return value
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  clientOrigin: requireEnvironmentVariable("CLIENT_ORIGIN"),
  databaseUrl: requireEnvironmentVariable("DATABASE_URL"),
  betterAuthUrl: requireEnvironmentVariable("BETTER_AUTH_URL"),
  r2Endpoint: requireEnvironmentVariable("R2_ENDPOINT"),
  r2AccessKeyId: requireEnvironmentVariable("R2_ACCESS_KEY_ID"),
  r2SecretAccessKey: requireEnvironmentVariable("R2_SECRET_ACCESS_KEY"),
  r2BucketName: requireEnvironmentVariable("R2_BUCKET_NAME"),
}
