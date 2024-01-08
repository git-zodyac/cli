import { major_version } from "../../config.js";

export const eDeps = {
  express: "latest",
  "@zodyac/express-core": `^${major_version}.0.0`,
};

export const eDevDeps = {
  "@types/express": "latest",
};
