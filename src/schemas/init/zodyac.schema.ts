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
};
