// Builders
import { replaceTscAliasPaths } from "tsc-alias";

// CLI
import ora from "ora";

import { throwError } from "../../view/errors.view.js";
import { ZProject } from "../project.js";
import { Diagnostic, SourceFile } from "ts-morph";
import { relative } from "path";
import chalk from "chalk";
import fs from "fs";
import { ChildProcess, spawn } from "child_process";

export class Builder {
  private progress = ora("Initializing project");

  constructor(public readonly project: ZProject) {}

  async build(): Promise<boolean> {
    try {
      this.progress.start("Building project...");

      const errors = this.runChecks();
      if (errors.length) {
        this.progress.fail("Failed to build project");
        errors.forEach((e) => this.throwDiagnostic(e));
        return false;
      }

      await this.project.ts.emit();

      await replaceTscAliasPaths({
        configFile: this.project.tsConfig,
        resolveFullPaths: true,
      });

      this.progress.succeed("Project built");

      return true;
    } catch (e: unknown) {
      this.progress.fail("Failed to build project");
      throwError(e as string, true);
      return false;
    }
  }

  async watch() {
    try {
      const errors = this.runChecks();
      errors.forEach((e) => this.throwDiagnostic(e));

      console.log(chalk.magenta(">"), "Watching project for changes...");

      fs.watch(this.project.root, { recursive: true }, (e, file) => {
        this.progress.start(`Analyzing changes...`);

        if (!file) return;
        if (!file.endsWith(".ts")) return;

        const source = this.project.ts.getSourceFile(file);
        if (!source) return;
        source.refreshFromFileSystemSync();

        const errors = this.runChecks();
        if (errors.length > 0) {
          this.progress.fail(`Project has errors:`);
          errors.forEach((e) => this.throwDiagnostic(e));
          return;
        }

        this.progress.succeed(`All good so far!`);
      });
    } catch (e: unknown) {
      throwError(e as string, true);
    }
  }

  private runner?: ChildProcess;
  private createRunner() {
    this.runner = spawn("node", ["dist/main"], {
      stdio: "inherit",
      cwd: this.project.root,
    });
    return this.runner;
  }

  async serve() {
    try {
      const errors = this.runChecks();
      errors.forEach((e) => this.throwDiagnostic(e));

      const built = await this.build();
      if (built) this.createRunner();

      console.log(chalk.magenta(">"), "Watching project for changes...");
      fs.watch(this.project.root, { recursive: true }, async (e, file) => {
        if (!file) return;
        if (!file.endsWith(".ts")) return;

        this.runner?.kill();

        const source = this.project.ts.getSourceFile(file);
        if (!source) return;
        source.refreshFromFileSystemSync();

        const built = await this.build();
        if (!built) return;

        this.createRunner();
      });
    } catch (e: unknown) {
      this.progress.fail("Failed to serve project");
      throwError(e as string, true);
    }
  }

  // runner?:

  public runChecks(): Diagnostic[] {
    const program = this.project.ts.getProgram();
    const sem = program.getSemanticDiagnostics();
    const syn = program.getSyntacticDiagnostics();
    const dec = program.getDeclarationDiagnostics();
    const glob = program.getGlobalDiagnostics();

    const errors = [...sem, ...syn, ...dec, ...glob];
    return errors;
  }

  private throwDiagnostic(d: Diagnostic) {
    const msg = d.getMessageText();
    const err = d.getCode();

    const ts_error = chalk.bgRed(`[TS${err}]`);

    if (typeof msg === "string") {
      console.error(ts_error, replaceQuotes(msg));
    } else {
      console.error(ts_error, msg);
    }

    const file = d.getSourceFile();

    if (file) this.throwFile(file, d);
  }

  private throwFile(file: SourceFile, d: Diagnostic): void {
    const filepath = relative(this.project.root, file?.getFilePath() ?? "");

    const pos = file?.getLineAndColumnAtPos(d.getStart()!);
    if (!pos) return;

    console.error(
      chalk.redBright(filepath),
      chalk.yellowBright(`${pos.line}:${pos.column}`),
    );

    const fullText = file.getFullText().split("\n");
    const preLine = fullText[pos.line - 2];
    const lineText = fullText[pos.line - 1];
    const postLine = fullText[pos.line];

    console.error(
      "\n" +
        chalk.gray(codeLine(pos.line - 1, preLine)) +
        codeLine(pos.line, chalk.yellowBright(lineText)) +
        chalk.gray(codeLine(pos.line + 1, postLine)),
    );
  }
}

function replaceQuotes(text: string) {
  return text.replace(/'([^']*)'/g, (_, p1) => chalk.blue(`"${p1}"`));
}
function codeLine(number: number, text: string) {
  return `${number}${lineSpaces(number)}|\t${text}\n`;
}
function lineSpaces(number: number) {
  return " ".repeat(3 - Math.floor(Math.log10(number)));
}
