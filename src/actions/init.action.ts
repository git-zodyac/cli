import { Initializer } from "../services/init/init.service.js";
import { InitInput } from "../services/init/init.config.js";
import { Adder } from "../services/add/add.service.js";
import { throwError } from "../view/errors.view.js";
import { Action } from "../utils/action/action.js";
import { input, confirm } from "@inquirer/prompts";
import { join } from "path";

export class Initialize extends Action {
  async init() {
    this.program
      .command("init")
      .description("Initialize new project")
      .option("-p, --project <name>", "Project name")
      .option("-r, --router", "Wheater to add router module (Express)")
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

    if (args.router == undefined) {
      const useRouter = await addRouterPrompt();
      args.router = useRouter ? "express" : undefined;
    } else {
      args.router = "express"; // TODO: Ask for router type
    }

    if (!args.project) {
      return throwError("No project name provided");
    }

    const path = join(this.cwd, args.project);
    const worker = new Initializer(path, args.project, args);

    const prj = await worker.createProject();
    if (!prj) return;

    if (args.router) {
      const adder = new Adder(path);
      await adder.initialize();
      const res = await adder.addRouter();
      if (!res) return;
    }
  }
}

async function askProjectName(): Promise<string | undefined> {
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
async function addRouterPrompt(): Promise<boolean> {
  try {
    return await confirm({
      message: "Would you like to add router module?",
      default: true,
    });
  } catch (e) {
    return false;
  }
}
