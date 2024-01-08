import { eDeps, eDevDeps } from "../../../schemas/add/router.schema.js";
import { NodePackages } from "../../../utils/helpers/npm.utils.js";
import { ER_SCHEMA } from "../../../schemas/add/express.schema.js";
import { ProvideInRoot } from "../../helpers/root.provide.js";
import { ZProject } from "../../project.js";

export async function addExpress(prj: ZProject) {
  await NodePackages.install(prj.root, eDeps);
  await NodePackages.installDev(prj.root, eDevDeps);

  const { ts } = prj;

  for (const [name, statements] of Object.entries(ER_SCHEMA)) {
    const file = ts.createSourceFile(prj.src_path(name), { statements });
    file.formatText();
    await file.save();
  }

  await ProvideInRoot(prj, "ExpressApp.routes(routes)", [
    {
      modules: ["routes"],
      path: "./app.router.js",
    },
    {
      modules: ["ExpressApp"],
      path: "@zodyac/express-core",
    },
  ]);
}
