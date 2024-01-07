import {
  PreferredRouter,
  ProjectConfig,
} from "../schemas/init/project.json.js";
import { writeJSON, readFile } from "../utils/files/files.js";

export class Project {
  private _config!: ProjectConfig;
  public get config() {
    return this._config;
  }

  constructor(public readonly root: string) {}

  async parse() {
    const config = await readFile<ProjectConfig>(`${this.root}/zodyac.json`);
    if (!config) throw new Error("Project is not initialized");
    this._config = config;
  }

  async setRouter(router: PreferredRouter) {
    this._config.router = router;
    await this.save();
  }

  async save() {
    await writeJSON(`${this.root}/zodyac.json`, this._config);
  }
}
