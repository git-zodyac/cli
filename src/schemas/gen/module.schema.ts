import { StructureKind } from "ts-morph";
import { TModuleSchema } from "../../utils/code-gen/generate.file";

export function ModuleSchema(className: string): TModuleSchema {
  return [
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "@zodyac/core",
      namedImports: [
        {
          kind: StructureKind.ImportSpecifier,
          name: "Module",
        },
      ],
    },
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "env.z",
      namedImports: [
        {
          kind: StructureKind.ImportSpecifier,
          name: "zEnv",
        },
      ],
    },
    "\n",
    {
      kind: StructureKind.Class,
      isExported: true,
      extends: "Module<typeof zEnv>",
      name: className,
    },
  ];
}
