import { Action } from "../utils/action/action.js";
import { input } from "@inquirer/prompts";
import chalk from "chalk";

export class Initialize extends Action {
  async init() {
    this.program
      .command("init")
      .description("Initialize new project")
      .option("-p, --project <name>", "Project name")
      .action((args) => this.execute(args));
  }

  async execute(args: { project?: string }) {
    console.log(args);

    if (!args.project) {
      args.project = await askProjectName();
    } else if (!args.project.match(/^[a-zA-Z_-]{1,255}$/i)) {
      args.project = await askProjectName();
    }

    if (!args.project) {
      console.log(chalk.red("No project name provided"));
      return;
    }

    console.log("init", args.project, this.cwd);
  }
}

async function askProjectName() {
  try {
    return await input({
      message: "What will be the project name?",
      validate: (value) => {
        if (value.length < 3) return "Please enter a project name";
        if (!value.match(/^[a-zA-Z_-]{1,255}$/i))
          return "Project name must be alphabetic, underscore, or hyphen";
        return true;
      },
    });
  } catch (e) {
    return undefined;
  }
}
