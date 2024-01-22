import { eDeps, eDevDeps } from "../../../schemas/add/router.schema.js";
import { NodePackages } from "../../../utils/helpers/npm.utils.js";
import { ER_SCHEMA } from "../../../schemas/add/express.schema.js";
import { runLint } from "../../../utils/helpers/eslint.utils.js";
import { GenerateFile } from "../../../utils/code-gen/generate.file.js";
// TODO: import { ProvideInRoot } from "../../../utils/code-gen/root.provide.js";
import { ZProject } from "../../project.js";

export async function addExpress(prj: ZProject) {
  await NodePackages.install(prj.root, eDeps);
  await NodePackages.installDev(prj.root, eDevDeps);

  for (const [name, statements] of Object.entries(ER_SCHEMA)) {
    await GenerateFile(prj, prj.src_path(name), statements);
  }

  // await ProvideInRoot(prj, "ExpressApp.routes(routes)", [
  //   {
  //     modules: ["routes"],
  //     path: "app.router",
  //   },
  //   {
  //     modules: ["ExpressApp"],
  //     path: "@zodyac/express-core",
  //   },
  // ]);

  if (prj.config?.has_eslint) await runLint(prj.root);
}
