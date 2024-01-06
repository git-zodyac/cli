import chalk from "chalk";
import figlet from "figlet";

const title = figlet.textSync("Zodyac");

export const cli_config = {
  name: "zy",
  version: "1.0.0",
  description: `${chalk.magenta(title)}\n
  CLI toolset for ${chalk.magenta("Zodyac")} framework.
  For more, see ${chalk.cyan("https://zodyac.dev")}
  `,
  help_before: `\n`,
  help_after: `\n`,
};

export const major_version = cli_config.version.split(".")[0];
export const minor_version = cli_config.version.split(".")[1];
export const patch_version = cli_config.version.split(".")[2];
