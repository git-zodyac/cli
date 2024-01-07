import { writeJSON } from "../../../utils/files/files.js";
import { tsconfig } from "../../../schemas/init/tsconfig.js";

export function InitTSConfig(root: string) {
  return writeJSON(`${root}/tsconfig.json`, tsconfig);
}
