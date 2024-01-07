import path from "path";
import {
  ProjectConfig,
  SRC_ENTRYPOINT,
  SRC_FOLDER,
} from "../schemas/init/project.json.js";
import { writeJSON, readFile } from "../utils/files/files.js";
import { major_version } from "../config.js";
import { Project } from "ts-morph";

export class ZProject {
  public readonly ts: Project;

  public get packageJSON() {
    return path.join(this.root, "package.json");
  }
  public get tsConfig() {
    return path.join(this.root, "tsconfig.json");
  }
  public get project() {
    return path.join(this.root, "zodyac.json");
  }

  public get entryPoint() {
    return path.join(this.root, this.config.entrypoint);
  }

  public src_path(...paths: string[]) {
    return path.join(this.root, SRC_FOLDER, ...paths);
  }

  constructor(
    public readonly root: string,
    public readonly config: ProjectConfig,
  ) {
    this.ts = new Project({
      tsConfigFilePath: this.tsConfig,
    });
  }

  static async create(
    root: string,
    options?: {
      eslint?: boolean;
    },
  ): Promise<ZProject> {
    const config: ProjectConfig = {
      entrypoint: SRC_ENTRYPOINT,
      core_version: parseInt(major_version),
      router: "",
      has_eslint: options?.eslint ?? false,
    };

    const out = new ZProject(root, config);

    await writeJSON(`${root}/zodyac.json`, config);

    return out;
  }

  static async parse(root: string) {
    const config = await readFile<ProjectConfig>(
      path.join(root, "zodyac.json"),
    );
    if (!config) return undefined;
    return new ZProject(root, config);
  }

  async save() {
    await writeJSON(this.project, this.config);
  }
}
