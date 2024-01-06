import { getValue, runCommand } from "./runner.js";

type DepMap = Record<string, string>;

function depsToArray(deps: DepMap): string[] {
  return Object.entries(deps).reduce((acc, [name, version]) => {
    acc.push(`${name}@${version}`);
    return acc;
  }, new Array<string>());
}

export abstract class NodePackages {
  static async installDev(path: string, deps: DepMap): Promise<true> {
    const dependencies = depsToArray(deps);
    await runCommand(path, "npm", ["install", "-D", ...dependencies]);
    return true;
  }
  static async install(path: string, deps: DepMap): Promise<true> {
    const dependencies = depsToArray(deps);
    await runCommand(path, "npm", ["install", ...dependencies]);
    return true;
  }
  static async uninstall(path: string, deps: DepMap): Promise<true> {
    const dependencies = depsToArray(deps);
    await runCommand(path, "npm", ["uninstall", ...dependencies]);
    return true;
  }

  static async currentUser(path: string): Promise<string | null> {
    try {
      return getValue(path, "npm", ["whoami"]);
    } catch (e) {
      return null;
    }
  }
}
