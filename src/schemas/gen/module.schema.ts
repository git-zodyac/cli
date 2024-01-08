import { Project, StructureKind } from "ts-morph";

export async function CreateModule(
  ts: Project,
  path: string,
  className: string,
): Promise<void> {
  const module = ts.createSourceFile(path, {
    statements: [
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
        moduleSpecifier: "../../env.z.js",
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
    ],
  });
  await module.save();
}
