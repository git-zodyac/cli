import { promises as fs } from "fs";

export async function createJSON<T extends object>(
  path: string,
  obj: T,
): Promise<true> {
  await fs.writeFile(path, JSON.stringify(obj, null, 2));
  return true;
}

export async function createFile(
  path: string,
  content: string | Buffer,
): Promise<true> {
  await fs.writeFile(path, content);
  return true;
}

export async function deleteFile(path: string): Promise<true> {
  await fs.unlink(path);
  return true;
}
