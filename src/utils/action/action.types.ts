import { Command } from "commander";
import { Action } from "./action.js";

export interface IApplication {
  program: Command;
  actions: Map<ActionConstructor, Action>;
  add(action: ActionConstructor): void;
  run(): void;
}

export interface ActionConstructor {
  new (app: IApplication): Action;
}
