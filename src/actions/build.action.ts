import { Builder } from "../services/build/build.service.js";
import { throwError } from "../view/errors.view.js";
import { Action } from "../utils/action/action.js";
import { ZProject } from "../services/project.js";

export class Build extends Action {
  init() {
    this.program
      .command("build")
      .description("Builds the project")
      .alias("b")
      .action(() => this.execute());
  }

  async execute() {
    const project = await ZProject.parse(this.cwd);
    if (!project) return throwError("Could not find Zodyac project");

    const worker = new Builder(project);
    await worker.build();
  }
}
