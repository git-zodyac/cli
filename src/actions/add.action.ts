import { Action } from "../utils/action/action.js";

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
    console.log(module);
  }
}
