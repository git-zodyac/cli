export const tsconfig = {
  compilerOptions: {
    /* Visit https://aka.ms/tsconfig to read more about this file */
    rootDir: "src",
    module: "ES2022",
    target: "ES2022",
    moduleResolution: "node",
    baseUrl: "./src",
    declaration: true,
    sourceMap: true,
    outDir: "dist",
    removeComments: true,
    allowSyntheticDefaultImports: true,
    strict: true,
    noImplicitAny: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
  },
  include: ["src/**/*"],
  exclude: ["dist", "node_modules"],
  "tsc-alias": {
    baseUrl: "./src",
    resolveFullPaths: true,
    paths: {},
  },
};
