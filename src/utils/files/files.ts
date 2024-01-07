import { promises as fs } from "fs";

export async function writeJSON<T extends object>(
  path: string,
  obj: T,
): Promise<true> {
  await fs.writeFile(path, JSON.stringify(obj, null, 2));
  return true;
}

export async function writeFile(
  path: string,
  content: string | Buffer,
): Promise<true> {
  await fs.writeFile(path, content);
  return true;
}

export async function readFile<T>(path: string): Promise<T | undefined> {
  try {
    const content = await fs.readFile(path, "utf-8");
    return JSON.parse(content);
  } catch (e) {
    return undefined;
  }
}

export async function deleteFile(path: string): Promise<true> {
  await fs.unlink(path);
  return true;
}
