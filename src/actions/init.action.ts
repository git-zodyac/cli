import { Initializer } from "../services/init.service.js";
import { throwError } from "../view/errors.view.js";
import { Action } from "../utils/action/action.js";
import { input } from "@inquirer/prompts";
import { join } from "path";
import { InitInput } from "services/init.config.js";

export class Initialize extends Action {
  async init() {
    this.program
      .command("init")
      .description("Initialize new project")
      .option("-p, --project <name>", "Project name")
      .option("--skip-eslint", "Skip eslint configuration")
      .option("--skip-git", "Skip git initialization")
      .option("--skip-docker", "Skip creating Dockerfile")
      .action((args) => this.execute(args));
  }

  async execute(args: InitInput) {
    if (!args.project) {
      args.project = await askProjectName();
    } else if (!args.project.match(/^[a-zA-Z_-]{1,255}$/i)) {
      args.project = await askProjectName();
    }

    if (!args.project) {
      return throwError("No project name provided");
    }

    const path = join(this.cwd, args.project);
    const worker = new Initializer(path, args.project, args);

    const { success } = await worker.createProject();
    if (!success) return;
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
