#!/usr/bin/env node
import { Application } from "./utils/app/app.js";
import { Initialize } from "./actions/init.action.js";
import { ExtList } from "./actions/ext-list.action.js";
import { AddModule } from "./actions/add.action.js";
import { Generate } from "./actions/gen.action.js";
import { Build } from "./actions/build.action.js";
import { Watch } from "./actions/watch.action.js";
import { Serve } from "./actions/serve.action.js";
import { cli_config } from "./config.js";
import "./utils/strings/string.js";

const app = new Application(cli_config);
app.add(Initialize);
app.add(AddModule);
app.add(Generate);
app.add(ExtList);
app.add(Build); // TODO: add build
app.add(Watch); // TODO: add watch
app.add(Serve);
// TODO: add test
app.run();

// TODO: migrate from "ts-morph" to native ts AST ?
