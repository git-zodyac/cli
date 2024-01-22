import { runLint } from "../helpers/eslint.utils.js";
import { ZProject } from "../../services/project.js";
import { SyntaxKind } from "ts-morph";

export async function ProvideInModule(
  prj: ZProject,
  target_path: string,
  provide: string,
  imports: { modules: string[]; path: string }[],
) {
  const { ts } = prj;

  const file = ts.getSourceFileOrThrow(target_path);
  const class_dec = file.getFirstChildByKindOrThrow(
    SyntaxKind.ClassDeclaration,
  );
  const decorator =
    class_dec.getDecorator("Module") ??
    class_dec.getDecorator("RootModule") ??
    class_dec.getDecoratorOrThrow("LeafModule");

  for (const { modules, path } of imports) {
    file.addImportDeclaration({
      moduleSpecifier: path,
      namedImports: modules,
    });
  }

  const decorator_arg = decorator.getArguments();
  if (decorator_arg.length) {
    const arg = decorator_arg[0];
    const obj = arg.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    const providers = obj.getProperty("providers");
    if (providers) {
      providers
        .getDescendantsOfKind(SyntaxKind.ArrayLiteralExpression)[0]
        .addElement(provide);
      // .asKindOrThrow(SyntaxKind.PropertyAssignment)
      // .getChildAtIndex(0)
      // .asKindOrThrow(SyntaxKind.Identifier)
      // .getChildAtIndex(0)
      // .asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
      // .addElement(provide);
    } else {
      obj.addPropertyAssignment({
        name: "providers",
        initializer: `[${provide}]`,
      });
    }
  } else {
    decorator.addArgument(`{ providers: [${provide}], }`);
  }

  file.formatText();
  await file.save();

  if (prj.config?.has_eslint) await runLint(prj.root);
}
