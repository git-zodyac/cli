import chalk from "chalk";

export function returnSuccess(message: string): void {
  console.log(chalk.green(">"), message);
}

export function returnNotice(message: string, command?: string): void {
  console.log(chalk.yellow(">"), message);

  if (command) console.log("\n", chalk.blue(">\t", command), "\n");
}
