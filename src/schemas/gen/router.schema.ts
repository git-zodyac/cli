import { StructureKind, VariableDeclarationKind } from "ts-morph";
import { TModuleSchema } from "../../utils/code-gen/generate.file.js";

function defaultRoutes(name: string): string {
  return `Routes([
    {
      path: "/",
      method: "put",
      handler: (req, res) => res.send("Hello from ${name}!"),
    },
    {
      path: "/:id",
      method: "get",
      handler: (req, res) => res.send("Hello from ${name}!"),
    },
    {
      path: "/",
      method: "post",
      handler: (req, res) => res.send("Hello from ${name}!"),
    },
    {
      path: "/:id",
      method: "delete",
      handler: (req, res) => res.send("Hello from ${name}!"),
    },
  ])`;
}
export function RoutesSchema(name: string): TModuleSchema {
  name = name.toLowerCase().trim();
  return [
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "@zodyac/express-core",
      namedImports: [
        {
          kind: StructureKind.ImportSpecifier,
          name: "Routes",
        },
      ],
    },
    "\n",
    {
      kind: StructureKind.VariableStatement,
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          kind: StructureKind.VariableDeclaration,
          initializer: defaultRoutes(name),
          name,
        },
      ],
    },
  ];
}
