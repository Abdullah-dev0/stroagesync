import { defineConfig } from "vite"
import vinext from "vinext"
import { cloudflare } from "@cloudflare/vite-plugin"
const tanstackQuery = ["@tanstack/react-query", "@tanstack/query-core"]

export default defineConfig({
  optimizeDeps: {
    exclude: tanstackQuery,
  },

  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
})
