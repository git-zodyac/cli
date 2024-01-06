export interface InitConfig {
  skipEslint: boolean;
  skipGit: boolean;
  skipDocker: boolean;
}
export interface InitInput extends InitConfig {
  project?: string;
}

export type InitOptions = Partial<InitConfig>;
