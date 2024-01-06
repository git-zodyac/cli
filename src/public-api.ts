import { Application } from "./utils/app/app.js";
import { Initialize } from "./actions/init.action.js";
import { AddModule } from "./actions/add.action.js";
import { Generate } from "./actions/gen.action.js";
import { cli_config } from "./config.js";

const app = new Application(cli_config);
app.add(Initialize);
app.add(AddModule);
app.add(Generate);
app.run();
