export type PreferredRouter = "express";
export interface ProjectConfig {
  name: string;
  router: PreferredRouter | "";
  core_version: number;
}
