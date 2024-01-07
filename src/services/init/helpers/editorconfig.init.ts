import { editorconfig } from "../../../schemas/init/editorconfig.js";
import { writeFile } from "../../../utils/files/files.js";

export async function InitEC(root: string) {
  return writeFile(`${root}/.editorconfig`, editorconfig);
}
