import { major_version } from "../../config.js";
import { ZProject } from "../project.js";

// CLI
import ora, { Ora } from "ora";
import { throwError } from "../../view/errors.view.js";

// Workers
import { createFolder } from "../../utils/files/folders.js";
import { writeJSON } from "../../utils/files/files.js";
import { NodePackages } from "../../utils/helpers/npm.utils.js";
import { runLint } from "../../utils/helpers/eslint.utils.js";
import { GenerateFile } from "../../utils/code-gen/create.module.js";

// Helpers
import { InitEC } from "./helpers/editorconfig.init.js";
import { InitTSConfig } from "./helpers/tsconfig.init.js";

// Schemas
import { packageJSON } from "../../schemas/init/package.json.js";
import { SRC_FOLDER } from "../../schemas/init/project.json.js";
import { ZODYAC_SRC_FILES } from "../../schemas/init/src.schema.js";

export class Initializer {
  private progress: Ora = ora("Initializing project");

  constructor(
    private readonly root: string,
    private readonly name: string,
  ) {}

  async createProject() {
    try {
      this.progress.start("Creating project files");

      this.progress.text = "Creating project folder";
      await createFolder(this.root);

      const pkg = await this.createPackageJson();

      this.progress.text = "Creating tsconfig.json";
      await InitTSConfig(this.root);

      this.progress.text = "Creating Editor config";
      await InitEC(this.root);

      this.progress.text = "Creating source folder";
      await createFolder(`${this.root}/${SRC_FOLDER}`);

      this.progress.text = "Creating zodyac.json";
      const prj = await ZProject.create(this.root);

      this.progress.text = "Adding source files";
      await this.addSourceFiles(prj);

      this.progress.succeed("Project files created");

      this.progress.start("Installing dependencies");
      await NodePackages.install(this.root, pkg.dependencies);
      await NodePackages.installDev(this.root, pkg.devDependencies);
      this.progress.succeed("Dependencies installed");

      return prj;
    } catch (e: unknown) {
      this.progress.fail("Failed to initialize project");
      throwError(e as string, true);

      return undefined;
    }
  }

  async createPackageJson() {
    this.progress.text = "Creating package.json";

    const pkg = packageJSON(this.name, major_version);

    const user = await NodePackages.currentUser(this.root);
    if (user) {
      pkg.name = `@${user}/${this.name}`;
      pkg.author = user;
    }

    await writeJSON(`${this.root}/package.json`, pkg);

    this.progress.text = "package.json created";

    return pkg;
  }

  async addSourceFiles(prj: ZProject) {
    await createFolder(prj.src_path("modules"));
    await createFolder(prj.src_path("models"));

    for (const [name, statements] of Object.entries(ZODYAC_SRC_FILES)) {
      await GenerateFile(prj, prj.src_path(name), statements);
    }

    if (prj.config?.has_eslint) await runLint(prj.root);
  }
}
