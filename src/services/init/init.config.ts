import { PreferredRouter } from "../../schemas/init/project.json.js";

export interface InitConfig {
  skipEslint: boolean;
  skipGit: boolean;
  skipDocker: boolean;
  router: PreferredRouter | undefined;
}
export interface InitInput extends InitConfig {
  project?: string;
}

export type InitOptions = Partial<InitConfig>;
