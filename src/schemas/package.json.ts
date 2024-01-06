export interface PackageJson {
  name: string;
  version: string;
  description: string;
  main: string;
  author?: string;
  scripts: Record<string, string>;
  keywords: string[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export const devDeps = {
  typescript: "^5.3.3",
};

export const elsintDeps = {
  "@typescript-eslint/eslint-plugin": "^6.15.0",
  "@typescript-eslint/parser": "^6.15.0",
  eslint: "^8.56.0",
  "eslint-plugin-prettier": "^5.1.0",
  prettier: "^3.1.1",
};
