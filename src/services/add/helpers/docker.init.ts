import { writeFile } from "../../../utils/files/files.js";
import { dockerfile } from "../../../schemas/init/docker.js";

export async function InitDocker(root: string) {
  return writeFile(`${root}/Dockerfile`, dockerfile);
}
