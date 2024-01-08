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
  const decorator = file
    .getFirstChildByKindOrThrow(SyntaxKind.ClassDeclaration)
    .getDecorator("Provide");

  for (const { modules, path } of imports) {
    file.addImportDeclaration({
      moduleSpecifier: path,
      namedImports: modules,
    });
  }

  if (!decorator) {
    file.addImportDeclaration({
      moduleSpecifier: "@zodyac/core",
      namedImports: ["Provide"],
    });

    const target = file.getFirstChildByKindOrThrow(SyntaxKind.ClassDeclaration);

    target.addDecorator({
      name: "Provide",
      arguments: [provide],
    });
  } else {
    const decorator_arg = decorator.getArguments();
    if (decorator_arg.length) {
      const arg = decorator_arg[0];
      if (!arg.isKind(SyntaxKind.ArrayLiteralExpression)) {
        arg.replaceWithText(`[${arg.getText()}]`);
      }
      const reargs = decorator.getArguments();
      reargs[0]
        .asKindOrThrow(SyntaxKind.ArrayLiteralExpression)
        .addElement(provide);
    } else {
      decorator.addArgument(provide);
    }
  }

  file.formatText();
  await file.save();

  if (prj.config?.has_eslint) await runLint(prj.root);
}
