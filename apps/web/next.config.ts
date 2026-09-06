import type { NextConfig } from "next"
import path from "node:path"

const nextConfig: NextConfig = {
  experimental: {
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
  transpilePackages: ["@workspace/ui"],
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
}

export default nextConfig
