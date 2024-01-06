import { Dir, promises as fs } from "fs";

export async function createFolder(path: string): Promise<true | never> {
  const exists: Dir | null = await fs.opendir(path).catch(() => null);

  if (exists) {
    const content = await fs.readdir(exists.path).catch(() => null);
    if (content?.length) throw new Error(`Folder ${path} is not empty`);

    return true;
  }

  await fs.mkdir(path);
  return true;
}

export async function deleteFolder(path: string): Promise<true | never> {
  await fs.rm(path, { recursive: true, force: true });
  return true;
}
