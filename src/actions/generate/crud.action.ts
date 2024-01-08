import { Command } from "commander";

export const CrudAction = new Command("crud")
  .alias("c")
  .description("Generate model, service, router, and module")
  .command("crud", "Generate a crud")
  .argument("<name>", "Name of the model");
