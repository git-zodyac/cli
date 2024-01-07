import { eDeps, eDevDeps } from "../../../schemas/add/router.schema.js";
import { NodePackages } from "../../../utils/helpers/npm.utils.js";

export async function addExpress(root: string) {
  await NodePackages.install(root, eDeps);
  await NodePackages.installDev(root, eDevDeps);
}
