import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts", "src/migrate.ts"],
  format: ["esm"],
  platform: "node",
  clean: true,
  noExternal: ["@workspace/validation"],
})
