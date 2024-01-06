import chalk from "chalk";

export function fileAdded(path: string): void {
  console.log(chalk.green("+"), path);
}

export function fileRemoved(path: string): void {
  console.log(chalk.red("-"), path);
}

export function fileChanged(path: string): void {
  console.log(chalk.yellow("~"), path);
}

export function fileUnchanged(path: string): void {
  console.log(chalk.gray("="), path);
}

export function fileError(path: string, err: unknown): void {
  console.log(chalk.red("❗️"), path);
  console.log(chalk.red(err));
}
