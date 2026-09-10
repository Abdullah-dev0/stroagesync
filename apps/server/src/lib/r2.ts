import { S3Client } from "@aws-sdk/client-s3"
import { env } from "../config/env"

export const s3 = new S3Client({
  region: "auto", // Required by AWS SDK, not used by R2
  endpoint: env.r2Endpoint,
  credentials: {
    accessKeyId: env.accessKeyId!,
    secretAccessKey: env.secretAccessKey!,
  },
  maxAttempts: 3,
})
