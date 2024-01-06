import { InitOptions } from "./init.config.js";

// CLI
import ora, { Ora } from "ora";
import { throwError } from "../view/errors.view.js";
import { returnNotice } from "../view/success.view.js";
import chalk from "chalk";

// Workers
import { createFolder } from "../utils/files/folders.js";
import { createFile, createJSON } from "../utils/files/files.js";
import { NodePackages } from "../utils/helpers/npm.utils.js";
import { GitHelper } from "../utils/helpers/git.utils.js";

// Schemas
import { PackageJson, devDeps, elsintDeps } from "../schemas/package.json.js";
import { editorconfig } from "../schemas/editorconfig.js";
import { eslintJson } from "../schemas/eslint.json.js";
import { gitignore } from "../schemas/gitignore.js";
import { dockerfile } from "../schemas/docker.js";
import { tsconfig } from "../schemas/tsconfig.js";
import { major_version } from "../config.js";

export class Initializer {
  private progress: Ora = ora("Initializing project");

  constructor(
    private readonly root: string,
    private readonly name: string,
    private readonly opts: InitOptions,
  ) {}

  async createProject() {
    try {
      this.progress.start("Creating project files");
      await this.createFolder();
      const pkg = await this.createPackageJson();
      await this.createTsConfig();
      await this.createSourceFolder();
      await this.createEditorConfig();

      this.progress.succeed("Project files created");

      await this.installDev(pkg);

      if (!this.opts.skipEslint) await this.addEslint();
      if (!this.opts.skipGit) await this.addGit();
      if (!this.opts.skipDocker) await this.addDocker();

      this.progress.succeed("Project initialized");
      return { success: true };
    } catch (e: unknown) {
      this.progress.fail("Failed to initialize project");
      throwError(e as string);

      return {
        success: false,
      };
    }
  }

  async createFolder() {
    this.progress.text = "Creating project folder";
    await createFolder(this.root);
    this.progress.text = "Project folder created";
  }

  async createPackageJson() {
    this.progress.text = "Creating package.json";

    const pkg: PackageJson = {
      name: this.name,
      version: "0.0.1",
      description: "A new amazing Zodyac project",
      main: "./dist/index.js",
      keywords: [],
      scripts: {
        start: "node ./dist/index.js",
        build: "tsc", // TODO: zy build
      },
      dependencies: {
        "@zodyac/core": `^${major_version}.0.0`,
      },
      devDependencies: {
        "@zodyac/cli": `^${major_version}.0.0`,
        ...devDeps,
      },
    };

    if (!this.opts.skipEslint) {
      pkg.scripts.lint = "eslint . --ext .ts";
    }

    const user = await NodePackages.currentUser(this.root);
    if (user) {
      pkg.name = `@${user}/${this.name}`;
      pkg.author = user;
    }

    await createJSON(`${this.root}/package.json`, pkg);

    this.progress.text = "package.json created";

    return pkg;
  }

  async createTsConfig() {
    this.progress.text = "Creating tsconfig.json";

    await createJSON(`${this.root}/tsconfig.json`, tsconfig);

    this.progress.text = "tsconfig.json created";
  }

  async createSourceFolder() {
    this.progress.text = "Creating source folder";

    await createFolder(`${this.root}/src`);

    this.progress.text = "Source folder created";
  }

  async createEditorConfig() {
    this.progress.text = "Creating Editor config";

    await createFile(`${this.root}/.editorconfig`, editorconfig);

    this.progress.text = "Editor config created";
  }

  async installDev(pkg: PackageJson) {
    this.progress.start("npm install: DevDependencies");

    await NodePackages.install(this.root, pkg.devDependencies);

    this.progress.succeed("Dependencies installed");
  }

  async addEslint() {
    try {
      this.progress.start("Adding eslint");

      await createJSON(`${this.root}/.eslintrc.json`, eslintJson);

      await NodePackages.installDev(this.root, elsintDeps);

      this.progress.succeed("Eslint added");
    } catch (e) {
      this.progress.fail("Could not add eslint");
      throwError(e as string);
      returnNotice(
        `You can skip adding eslint by adding ${chalk.blue("--skip-eslint")}:`,
        "zy init --skip-eslint",
      );
    }
  }

  async addGit() {
    try {
      this.progress.start("Initializing git");

      await createFile(`${this.root}/.gitignore`, gitignore);
      await GitHelper.init(this.root);
      await GitHelper.addAll(this.root);

      this.progress.succeed("Git initialized");
    } catch (e) {
      this.progress.fail("Could not initialize Git");
      throwError(e as string);
      returnNotice(
        `You can creating Git by adding ${chalk.blue("--skip-git")}:`,
        "zy init --skip-git",
      );
    }
  }

  async addDocker() {
    this.progress.text = "Creating Dockerfile";

    await createFile(`${this.root}/Dockerfile`, dockerfile);

    this.progress.text = "Dockerfile created";
  }
}
