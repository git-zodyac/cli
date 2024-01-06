import { runCommand } from "./runner.js";

export abstract class GitHelper {
  static async init(path: string): Promise<true> {
    await runCommand(path, "git", ["init"]);
    return true;
  }

  static async addAll(path: string): Promise<true> {
    await runCommand(path, "git", ["add", "."]);
    return true;
  }
}
