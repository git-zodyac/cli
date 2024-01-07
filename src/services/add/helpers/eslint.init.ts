import { eslintJson } from "../../../schemas/init/eslint.json.js";
import { PackageJson, elsintDeps } from "../../../schemas/init/package.json.js";
import { NodePackages } from "../../../utils/helpers/npm.utils.js";
import { runCommand } from "../../../utils/helpers/runner.js";
import { readFile, writeJSON } from "../../../utils/files/files.js";

export async function InitEslint(root: string) {
  const pkg = await readFile<PackageJson>(`${root}/package.json`);
  if (!pkg) throw new Error("package.json not found");

  await writeJSON(`${root}/.eslintrc.json`, eslintJson);
  await NodePackages.installDev(root, elsintDeps);
  pkg.scripts.lint = "eslint . --ext .ts --fix";
  await writeJSON(`${root}/package.json`, pkg);

  await runCommand(root, "eslint", ["--fix", "."]);
}
