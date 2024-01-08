import { createFolder } from "../../utils/files/folders.js";
import { addExpress } from "./helpers/express.helper.js";
import { returnNotice } from "../../view/success.view.js";
import { throwError } from "../../view/errors.view.js";
import { ZProject } from "../project.js";
import chalk from "chalk";
import ora from "ora";

// Helpers
import { InitDocker } from "./helpers/docker.init.js";
import { InitEslint } from "./helpers/eslint.init.js";
import { InitGit } from "./helpers/git.init.js";

export class Adder {
  private progress = ora("Initializing project");

  constructor(public readonly project: ZProject) {}

  async express() {
    try {
      this.progress.start("Adding Express module");
      // TODO: check if same router module is installed

      this.project.config.router = "express";
      await this.project.save();

      this.progress.start("Installing dependencies...");
      await addExpress(this.project);
      this.progress.succeed("Express module added");

      await createFolder(this.project.src_path("routers"));
      await createFolder(this.project.src_path("services"));
      await createFolder(this.project.src_path("views"));
    } catch (e: unknown) {
      this.progress.fail("Failed to add express router");
      throwError(e as string, true);
    }
  }

  async eslint() {
    try {
      this.progress.start("Adding eslint");

      await InitEslint(this.project.root);
      this.project.config.has_eslint = true;
      await this.project.save();

      this.progress.succeed("Eslint added");
    } catch (e) {
      this.progress.fail("Could not add eslint");
      throwError(e as string, true);
      returnNotice(
        `You can skip adding eslint by adding ${chalk.blue("--skip-eslint")}:`,
        "zy init --skip-eslint",
      );
    }
  }

  async git() {
    try {
      this.progress.start("Initializing git");
      await InitGit(this.project.root);
      this.progress.succeed("Git initialized");
    } catch (e) {
      this.progress.fail("Could not initialize Git");
      throwError(e as string, true);
      returnNotice(
        `You can creating Git by adding ${chalk.blue("--skip-git")}:`,
        "zy init --skip-git",
      );
    }
  }

  async docker() {
    try {
      this.progress.start("Creating Dockerfile");
      await InitDocker(this.project.root);
      this.progress.succeed("Dockerfile created");
    } catch (e) {
      this.progress.fail("Could not create Dockerfile");
      throwError(e as string, true);
      returnNotice(
        `You can creating Dockerfile by adding ${chalk.blue("--skip-docker")}:`,
        "zy init --skip-docker",
      );
    }
  }
}
