#!/usr/bin/env node
import { Application } from "./utils/app/app.js";
import { Initialize } from "./actions/init.action.js";
import { ExtList } from "./actions/ext-list.action.js";
import { AddModule } from "./actions/add.action.js";
import { Generate } from "./actions/gen.action.js";
import { cli_config } from "./config.js";
import "./utils/strings/string.js";

const app = new Application(cli_config);
app.add(Initialize);
app.add(AddModule);
app.add(Generate);
app.add(ExtList);
app.run();
