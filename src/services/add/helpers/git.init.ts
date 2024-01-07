import { GitHelper } from "../../../utils/helpers/git.utils.js";
import { gitignore } from "../../../schemas/init/gitignore.js";
import { writeFile } from "../../../utils/files/files.js";

export async function InitGit(root: string) {
  await writeFile(`${root}/.gitignore`, gitignore);
  await GitHelper.init(root);
  await GitHelper.addAll(root);
}
