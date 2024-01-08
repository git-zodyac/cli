import { Builder } from "../services/build/build.service.js";
import { throwError } from "../view/errors.view.js";
import { Action } from "../utils/action/action.js";
import { ZProject } from "../services/project.js";

export class Serve extends Action {
  init(): void {
    this.program
      .command("serve")
      .description("Watches and builds the project")
      .alias("s")
      .action(() => this.execute());
  }

  async execute(): Promise<void> {
    const project = await ZProject.parse(this.cwd);
    if (!project) return throwError("Could not find Zodyac project");

    const worker = new Builder(project);
    await worker.serve();
  }
}
