import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/public-api.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
