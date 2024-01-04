import { ActionConstructor } from "../action/action.types.js";
import { Action } from "../action/action.js";
import { CliConfig } from "./config.types.js";
import { Command, program } from "commander";

export class Application {
  program: Command = program;

  actions: Map<ActionConstructor, Action> = new Map();

  constructor(config: CliConfig) {
    this.program
      .version(config.version)
      .name(config.name)
      .description(config.description);

    if (config.help_before)
      this.program.addHelpText("before", config.help_before);

    if (config.help_after)
      this.program.addHelpText("afterAll", config.help_after);
  }

  add(action: ActionConstructor) {
    const instance = new action(this);
    this.actions.set(action, instance);
    instance.init();
  }

  run() {
    const opts = program.parse(process.argv);

    if (opts.args.length === 0) program.help();
  }
}
