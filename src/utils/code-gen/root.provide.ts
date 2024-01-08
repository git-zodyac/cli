import { runLint } from "../helpers/eslint.utils.js";
import { ZProject } from "../../services/project.js";
import { SyntaxKind } from "ts-morph";

export async function ProvideInRoot(
  prj: ZProject,
  module: string,
  imports: { modules: string[]; path: string }[],
): Promise<void> {
  const { ts } = prj;

  const app = ts.getSourceFileOrThrow(prj.src_path("app.module.ts"));

  for (const { modules, path } of imports) {
    app.addImportDeclaration({
      moduleSpecifier: path,
      namedImports: modules,
    });
  }

  const app_class = app.getVariableDeclarationOrThrow("app");
  const app_init = app_class.getInitializerIfKindOrThrow(
    SyntaxKind.NewExpression,
  );
  const conf = app_init.getArguments()[0];
  const providers = conf
    .asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    .getPropertyOrThrow("providers");

  providers
    .asKindOrThrow(SyntaxKind.PropertyAssignment)
    .getFirstChildByKindOrThrow(SyntaxKind.ArrayLiteralExpression)
    .addElement(module);

  app.formatText();
  await app.save();

  if (prj.config?.has_eslint) await runLint(prj.root);
}
