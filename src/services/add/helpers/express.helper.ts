import { eDeps, eDevDeps } from "../../../schemas/add/router.schema.js";
import { NodePackages } from "../../../utils/helpers/npm.utils.js";
import { ER_SCHEMA } from "../../../schemas/add/express.schema.js";
import { ZProject } from "../../project.js";
import { SyntaxKind } from "ts-morph";

export async function addExpress(prj: ZProject) {
  await NodePackages.install(prj.root, eDeps);
  await NodePackages.installDev(prj.root, eDevDeps);

  const { ts } = prj;

  for (const [name, statements] of Object.entries(ER_SCHEMA)) {
    const file = ts.createSourceFile(prj.src_path(name), { statements });
    file.formatText();
    await file.save();
  }

  const app = ts.getSourceFileOrThrow(prj.src_path("app.module.ts"));
  app.addImportDeclaration({
    moduleSpecifier: "./app.router.js",
    namedImports: ["routes"],
  });

  app.addImportDeclaration({
    moduleSpecifier: "@zodyac/express-core",
    namedImports: ["ExpressApp"],
  });

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
    .addElement("ExpressApp.routes(routes)");

  app.formatText();
  await app.save();
}
