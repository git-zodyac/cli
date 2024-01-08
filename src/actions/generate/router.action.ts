import { Command } from "commander";

export const RouterAction = new Command("router")
  .alias("r")
  .command("router", "Generate a router")
  .argument("<name>", "Name of the router")
  .option("-n, --nest", "path of the parent router");
