import { join } from "path";
import { Action } from "../utils/action/action.js";

export class Generate extends Action {
  init() {
    this.program
      .command("generate")
      .argument("<type>", "Type of module to generate")
      .argument("<path>", "Path to generate module")
      .description("Generate a module")
      .alias("g")
      .action((type, path) => this.execute(type, path));
  }

  async execute(type: string, path: string) {
    const output_path = join(this.cwd, path);
    console.log(type, output_path);
  }
}
