import { runCommand } from "./runner.js";

export async function runLint(root: string): Promise<void> {
  try {
    await runCommand(root, "eslint", [".", "--ext", ".ts", "--fix"]);
  } catch (error) {
    return;
  }
}
