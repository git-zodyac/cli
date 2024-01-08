import {
  OptionalKind,
  SourceFileStructure,
  StructureKind,
  VariableDeclarationKind,
} from "ts-morph";

export const DEF_ROUTER = `Routes([
  {
    path: '/',
    method: 'get',
    handler: (req, res) => {
      return res.send('Hello, Zodyac!');
    },
  },
])`;

export const ER_SCHEMA: Record<
  string,
  OptionalKind<SourceFileStructure>["statements"]
> = {
  "app.router.ts": [
    {
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier: "@zodyac/express-core",
      namedImports: ["Routes"],
    },
    "\n",
    {
      kind: StructureKind.VariableStatement,
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          name: "routes",
          initializer: DEF_ROUTER,
        },
      ],
    },
  ],
};
