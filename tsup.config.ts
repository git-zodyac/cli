import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/public-api.ts"],
  format: ["esm"],
  splitting: false,
  sourcemap: true,
  clean: true,
});
