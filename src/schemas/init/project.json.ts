export type PreferredRouter = "express";
export interface ProjectConfig {
  router: PreferredRouter | "";
  core_version: number;
  entrypoint: string;
  has_eslint: boolean;
}

export const ENTRYPOINT = "main";
export const DIST_FOLDER = "dist";
export const SRC_FOLDER = "src";
export const DIST_ENTRYPOINT = `${DIST_FOLDER}/${ENTRYPOINT}.js`;
export const SRC_ENTRYPOINT = `${SRC_FOLDER}/${ENTRYPOINT}.ts`;
