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
        {
          kind: StructureKind.ImportSpecifier,
          name: "Logger",
        },
      ],
    },
    "\n",
    {
      kind: StructureKind.Class,
      isExported: true,
      decorators: [
        {
          kind: StructureKind.Decorator,
          name: "Module",
          arguments: [],
        },
      ],
      name: className,
      ctors: [
        {
          kind: StructureKind.Constructor,
          parameters: [
            {
              kind: StructureKind.Parameter,
              isReadonly: true,
              name: "logger",
              type: "Logger",
            },
          ],
        },
      ],
      methods: [
        {
          kind: StructureKind.Method,
          name: "onInit",
          parameters: [],
          statements: `this.logger.info('${className} initialized!')`,
        },
      ],
    },
  ];
}
