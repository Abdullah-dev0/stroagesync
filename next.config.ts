import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: { unoptimized: true },
  // sharp uses native .node binaries that cannot run on Cloudflare Workers (V8-based).
  // With images.unoptimized=true Next.js doesn't need sharp at runtime, but it's still
  // a transitive dep of `next` itself — exclude it from file tracing so it isn't copied
  // into the .open-next output. The pnpm patch on @opennextjs/cloudflare aliases it to a
  // throw shim in the esbuild bundle step.
  outputFileTracingExcludes: {
    "**/*": ["sharp", "@img/*"],
  },
  outputFileTracingIncludes: {
    "**/*": [
      "./node_modules/pg-cloudflare/dist/**",
      "./node_modules/pg-cloudflare/esm/**",
    ],
  },
}

export default nextConfig

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"
initOpenNextCloudflareForDev()
