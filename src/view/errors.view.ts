import chalk from "chalk";

export function throwError(err: string, stack?: string): void {
  console.error("❗️", chalk.red(err));
  if (stack) console.error(stack);
}
