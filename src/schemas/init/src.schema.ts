import {
  OptionalKind,
  SourceFileStructure,
  StructureKind,
  VariableDeclarationKind,
} from "ts-morph";

const DEF_ZENV = `z.object({ PORT: z.number().default(3000), /* ... add your environment variables here */ })`;
const DEF_APP = `new App({
  env: zEnv,
  providers: [],
})`;
export const ZODYAC_SRC_FILES: Record<
  string,
  OptionalKind<SourceFileStructure>["statements"]
> = {
  "env.z.ts": [
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "zod",
      namedImports: ["z"],
    },
    "\n",
    {
      kind: StructureKind.VariableStatement,
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          name: "zEnv",
          initializer: DEF_ZENV,
        },
      ],
    },
  ],
  "app.module.ts": [
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "@zodyac/core",
      namedImports: ["App"],
    },
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "env.z",
      namedImports: ["zEnv"],
    },
    "\n",
    {
      kind: StructureKind.VariableStatement,
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          name: "app",
          initializer: DEF_APP,
        },
      ],
    },
  ],
  "main.ts": [
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "app.module",
      namedImports: ["app"],
    },
    "\n",
    "app.start();",
    "app.onInit = () => { app.logger.info('App init'); }",
    "app.onReady = () => { app.logger.info('App ready'); }",
    "app.onStart = () => { app.logger.info('App start'); }",
    "app.onDestroy = () => { app.logger.info('App destroy'); }",
  ],
};
