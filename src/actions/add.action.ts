import { zAddModule } from "./validators/module.validator.js";
import { returnNotice } from "../view/success.view.js";
import { Adder } from "../services/add/add.service.js";
import { throwError } from "../view/errors.view.js";
import { Action } from "../utils/action/action.js";
import { ZProject } from "../services/project.js";
import chalk from "chalk";

export class AddModule extends Action {
  init() {
    this.program
      .command("add")
      .argument("<ext...>", "Zodyac extentions to add")
      .description("Adds extentions to your project")
      .alias("a")
      .action((ext) => this.execute(ext));
  }

  async execute(ext: string[]) {
    const project = await ZProject.parse(this.cwd);
    if (!project) return throwError("Could not find Zodyac project");
    const worker = new Adder(project);

    for (const e of ext) {
      const mod = zAddModule.safeParse(e);
      if (!mod.success) {
        throwError("No such extention: " + chalk.blue(e));
        returnNotice(
          `You can check available extentions with ${chalk.blue("list")}`,
          chalk.blue("zy list"),
        );
        continue;
      }

      await worker[mod.data]();
    }
  }
}
