import { NodePackages } from "../../utils/helpers/npm.utils.js";
import { throwError } from "../../view/errors.view.js";
import { major_version } from "../../config.js";
import { Project } from "../project.js";
import ora, { Ora } from "ora";

export class Adder {
  private progress: Ora = ora("Initializing project");

  private _prj!: Project;

  constructor(private readonly root: string) {}

  async initialize() {
    try {
      this._prj = new Project(this.root);
      await this._prj.parse();
    } catch (e: unknown) {
      console.error("Failed to read project config");
      throwError(e as string);
      return false;
    }
  }

  async addRouter() {
    try {
      this.progress.start("Adding router module");
      if (!this._prj.config.router) await this._prj.setRouter("express");

      await NodePackages.install(this.root, {
        express: "latest",
        "@zodyac/express-module": `^${major_version}.0.0`,
      });

      await NodePackages.installDev(this.root, {
        "@types/express": "latest",
      });

      this.progress.succeed("Router module added");

      return true;
    } catch (e: unknown) {
      this.progress.fail("Failed to add router module");
      throwError(e as string);

      return false;
    }
  }
}
