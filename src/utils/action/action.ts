import { IApplication } from "./action.types.js";
import { Command } from "commander";

export abstract class Action {
  protected program: Command;
  protected cwd: string = process.cwd();

  constructor(protected app: IApplication) {
    this.program = app.program;
  }

  abstract init(): void;
  abstract execute(...args: unknown[]): void;
}
