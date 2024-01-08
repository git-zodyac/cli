import { throwError } from "../view/errors.view.js";
import { Action } from "../utils/action/action.js";
import { ZProject } from "../services/project.js";
import { Builder } from "../services/build/build.service.js";

export class Watch extends Action {
  init() {
    this.program
      .command("watch")
      .description("Watches project for changes")
      .alias("w")
      .action(() => this.execute());
  }

  async execute() {
    const project = await ZProject.parse(this.cwd);
    if (!project) return throwError("Could not find Zodyac project");
    const worker = new Builder(project);
    await worker.watch();
  }
}
