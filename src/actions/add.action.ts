import { zAddModule } from "./validators/module.validator.js";
import { Adder } from "../services/add/add.service.js";
import { throwError } from "../view/errors.view.js";
import { Action } from "../utils/action/action.js";
import { ZProject } from "../services/project.js";

export class AddModule extends Action {
  init() {
    this.program
      .command("add")
      .argument("<module>", "A Zodyac module to add")
      .description("Adds a Zodyac module to your project")
      .alias("a")
      .action((module) => this.execute(module));
  }

  async execute(module: string) {
    const mod = zAddModule.safeParse(module);
    if (!mod.success) return throwError("No such module:" + module);

    const project = await ZProject.parse(this.cwd);
    if (!project) return throwError("Could not find Zodyac project");

    const worker = new Adder(project);
    await worker[mod.data]();
  }
}
