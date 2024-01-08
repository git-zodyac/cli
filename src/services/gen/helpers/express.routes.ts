import { runLint } from "../../../utils/helpers/eslint.utils.js";
import { ZProject } from "../../project.js";
import { SyntaxKind } from "ts-morph";

function embedRouter(name: string) {
  return `{
    path: "/${name.replace("_routes", "")}",
    routes: ${name},
  }`;
}
export async function ProvideInRouter(
  prj: ZProject,
  target_path: string,
  provide: string,
  imports: { modules: string[]; path: string }[],
) {
  const { ts } = prj;

  const file = ts.getSourceFileOrThrow(target_path);

  for (const { modules, path } of imports) {
    file.addImportDeclaration({
      moduleSpecifier: path,
      namedImports: modules,
    });
  }

  const func = file.getFirstDescendantByKindOrThrow(SyntaxKind.CallExpression);
  const arg = func.getArguments()[0];

  if (!arg) {
    func.addArgument(`[${embedRouter(provide)}]`);
  } else if (arg.isKind(SyntaxKind.ArrayLiteralExpression)) {
    arg.addElement(embedRouter(provide));
  } else if (arg.isKind(SyntaxKind.Identifier)) {
    arg.replaceWithText(`[...${arg.getText()}, ${embedRouter(provide)}]`);
  } else {
    throw new Error("Invalid argument for Router");
  }

  file.formatText();
  await file.save();

  if (prj.config?.has_eslint) await runLint(prj.root);
}
