import { Application } from "./utils/app/app.js";
import { Initialize } from "./actions/init.action.js";
import { Generate } from "./actions/gen.action.js";
import { cli_config } from "./config.js";

const app = new Application(cli_config);
app.add(Initialize);
app.add(Generate);
app.run();
