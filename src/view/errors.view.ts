import chalk from "chalk";

export function throwError(err: string, trace?: boolean): void {
  console.error(chalk.red("!"), chalk.red(err));
  if (trace) console.trace();
}
