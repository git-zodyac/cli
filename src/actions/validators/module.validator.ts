import { z } from "zod";

export const zRouters = z.enum(["express"]);
export const zAdditions = z.enum(["eslint", "docker", "git"]);
export const zAddModule = zRouters.or(zAdditions);

export type zAddModule = z.infer<typeof zAddModule>;
