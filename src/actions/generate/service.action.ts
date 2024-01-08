import { Command } from "commander";

export const ServiceAction = new Command("service")
  .alias("s")
  .description("Generate a service")
  .command("service", "Generate a service")
  .argument("<name>", "Name of the service")
  .option("--skip-def", "Skip creating a definition file");
