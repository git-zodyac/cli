import { Initializer } from "../services/init/init.service.js";
import { zProjectName } from "./validators/init.validator.js";
import { InitInput } from "../services/init/init.config.js";
import { Adder } from "../services/add/add.service.js";
import { throwError } from "../view/errors.view.js";
import { Action } from "../utils/action/action.js";
import { input } from "@inquirer/prompts";
// TODO: import { input, confirm } from "@inquirer/prompts";
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

    // if (args.router == undefined) {
    //   const useRouter = await addRouterPrompt();
    //   args.router = useRouter ? "express" : undefined;
    // } else {
    //   args.router = "express"; // TODO: Ask for router type
    // }

    if (!args.project) {
      return throwError("No project name provided");
    }

    const path = join(this.cwd, args.project);
    const worker = new Initializer(path, args.project);

    const prj = await worker.createProject();
    if (!prj) return;

    const adder = new Adder(prj);

    if (args.router) await adder.express();
    if (!args.skipEslint) await adder.eslint();
    if (!args.skipDocker) await adder.docker();
    if (!args.skipGit) await adder.git();
  }
}

async function askProjectName(): Promise<string | undefined> {
  try {
    return await input({
      message: "What will be the project name?",
      validate: (value) => {
        const res = zProjectName.safeParse(value);
        if (!res.success) return res.error.errors[0].message;
        return true;
      },
    });
  } catch (e) {
    return undefined;
  }
}

// async function addRouterPrompt(): Promise<boolean> {
//   try {
//     return await confirm({
//       message: "Would you like to add router module?",
//       default: true,
//     });
//   } catch (e) {
//     return false;
//   }
// }
