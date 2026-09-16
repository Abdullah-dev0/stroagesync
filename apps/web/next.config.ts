import type { NextConfig } from "next"
import path from "node:path"

const monorepoRoot = path.resolve(__dirname, "../..")

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: monorepoRoot,
  transpilePackages: ["@workspace/ui"],
  turbopack: {
    root: monorepoRoot,
  },
}

export default nextConfig
