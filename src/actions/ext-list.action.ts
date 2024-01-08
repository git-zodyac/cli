import { Action } from "../utils/action/action.js";
import { ZExtentions, extStatus } from "../extentions.js";
import chalk from "chalk";

export class ExtList extends Action {
  init() {
    this.program
      .command("list")
      .description("Lists available Zodyac extentions")
      .alias("l")
      .action(() => this.execute());
  }

  execute() {
    console.log(
      "\n",
      chalk.blue(">"),
      "You can add extentions with",
      chalk.blue("zy add <ext...>"),
      "\n",
    );

    for (const [name, desc] of Object.entries(ZExtentions)) {
      const color = extStatus(desc);
      const separator = name.length > 6 ? "\t" : "\t\t";
      const text = desc.startsWith("x")
        ? chalk.gray(desc.slice(2))
        : desc.slice(2);

      console.log(chalk[color](name), separator, text);
    }
  }
}
