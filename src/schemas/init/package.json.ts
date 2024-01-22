import { DIST_ENTRYPOINT } from "./project.json.js";

export interface PackageJson {
  name: string;
  version: string;
  description: string;
  main: string;
  author?: string;
  scripts: Record<string, string>;
  keywords: string[];
  type: "module";
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export const DEPS = {
  zod: "^3.0.0",
};

export const devDeps = {
  typescript: "^5.3.3",
  "tsc-alias": "latest",
};

export const elsintDeps = {
  "@typescript-eslint/eslint-plugin": "^6.15.0",
  "@typescript-eslint/parser": "^6.15.0",
  eslint: "^8.56.0",
  "eslint-plugin-prettier": "^5.1.0",
  prettier: "^3.1.1",
};

export function packageJSON(
  name: string,
  major_version: number | string,
  isBeta: boolean,
): PackageJson {
  const core = isBeta ? `^${major_version}.0.0-beta` : `^${major_version}.0.0`;
  return {
    name,
    version: "0.0.1",
    description: "A new amazing Zodyac project",
    main: DIST_ENTRYPOINT,
    type: "module",
    keywords: [],
    scripts: {
      start: `node ${DIST_ENTRYPOINT}`,
      build: "tsc",
    },
    dependencies: {
      "@zodyac/core": core,
      ...DEPS,
    },
    devDependencies: {
      "@zodyac/cli": `^${major_version}.0.0`,
      ...devDeps,
    },
  };
}
