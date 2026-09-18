import "server-only"

function requireEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }

  return value
}

export const env = {
  betterAuthUrl: requireEnvironmentVariable("BETTER_AUTH_URL"),
  r2Endpoint: requireEnvironmentVariable("R2_ENDPOINT"),
  r2AccessKeyId: requireEnvironmentVariable("R2_ACCESS_KEY_ID"),
  r2SecretAccessKey: requireEnvironmentVariable("R2_SECRET_ACCESS_KEY"),
  r2BucketName: requireEnvironmentVariable("R2_BUCKET_NAME"),
}
