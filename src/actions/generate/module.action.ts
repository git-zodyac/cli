import { Command } from "commander";

export const ModuleAction = new Command("module")
  .alias("m")
  .description("Generate a module")
  .argument("<name>", "Name of the module")
  .option(
    "-p, --provide <path>",
    "path of the parent module, defaults to root",
  );
