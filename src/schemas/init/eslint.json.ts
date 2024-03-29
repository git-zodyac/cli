export const eslintJson = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-namespace": "off",
  },
  ignorePatterns: [
    "src/**/*.spec.ts",
    "karma.conf.js",
    "src/**/*.json",
    "dist",
    "node_modules",
  ],
  root: true,
};
