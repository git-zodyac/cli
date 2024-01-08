import { Command } from "commander";

export const GuardAction = new Command("guard")
  .alias("g")
  .description("Generate a guard")
  .command("guard", "Generate a guard")
  .argument("<name>", "Name of the guard");
