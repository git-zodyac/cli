import {
  OptionalKind,
  SourceFileStructure,
  StructureKind,
  VariableDeclarationKind,
} from "ts-morph";

const DEF_ZENV = `z.object({ PORT: z.number().default(3000), /* ... add your environment variables here */ })`;

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
    "\n",
    {
      kind: StructureKind.TypeAlias,
      isExported: true,
      name: "Environment",
      type: "z.infer<typeof zEnv>",
    },
  ],
  "app.module.ts": [
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "@zodyac/core",
      namedImports: ["Module, Logger"],
    },
    "\n",
    {
      kind: StructureKind.Class,
      isExported: true,
      decorators: [
        {
          name: "Module",
          kind: StructureKind.Decorator,
          arguments: [],
        },
      ],
      name: "Application",
      ctors: [
        {
          kind: StructureKind.Constructor,
          parameters: [
            {
              name: "logger",
              type: "Logger",
              isReadonly: true,
            },
          ],
        },
      ],
      methods: [
        {
          kind: StructureKind.Method,
          name: "onInit",
          parameters: [],
          statements: "this.logger.info('Application initialized!')",
        },
      ],
    },
  ],
  "main.ts": [
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "@zodyac/core",
      namedImports: ["runApp", "EnvProvider"],
    },
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "app.module",
      namedImports: ["Application"],
    },
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "env.z",
      namedImports: ["zEnv"],
    },
    "\n",
    "EnvProvider.parse(zEnv)",
    "\n",
    "runApp(Application)",
  ],
};
