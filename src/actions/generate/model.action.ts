import { Command } from "commander";

export const ModelAction = new Command("model")
  .alias("md")
  .description("Generate a model")
  .command("model", "Generate a model")
  .argument("<name>", "Name of the model");
