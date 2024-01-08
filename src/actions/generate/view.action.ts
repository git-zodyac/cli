import { Command } from "commander";

export const ViewAction = new Command("view")
  .alias("v")
  .description("Generate a view")
  .command("view", "Generate a view")
  .argument("<name>", "Name of the view")
  .option("-s, --service", "Path to a service definition file");
