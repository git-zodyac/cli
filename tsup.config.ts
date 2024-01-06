import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/public-api.ts"],
  format: ["esm"],
  splitting: false,
  sourcemap: false,
  clean: true,
});
