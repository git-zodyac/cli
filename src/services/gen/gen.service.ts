import { ModuleSchema } from "../../schemas/gen/module.schema.js";
import { GenerateFile } from "../../utils/code-gen/create.module.js";
import { ProvideInModule } from "../../utils/code-gen/module.provide.js";
import { ProvideInRoot } from "../../utils/code-gen/root.provide.js";
import { throwError } from "../../view/errors.view.js";
import { fileAdded } from "../../view/file.view.js";
import { ZProject } from "../project.js";
import { join, relative } from "path";
import chalk from "chalk";
import ora from "ora";

interface GeneratorResult {
  name: string;
  path: string;
}

export class Generator {
  private progress = ora("Initializing project");

  constructor(private readonly project: ZProject) {}

  async module(
    name: string,
    opts: { provide?: string } = {},
  ): Promise<GeneratorResult | undefined> {
    const m_name = name.capitalize() + "Module";
    const path = join("modules", name, name + ".module.ts");
    const abs_path = this.project.src_path(path);

    try {
      this.progress.start(`Adding module ${display(name)}`);

      const schema = ModuleSchema(m_name);
      await GenerateFile(this.project, abs_path, schema);

      this.progress.succeed(`Module ${display(name)} added`);
      fileAdded(`${path}\n`);

      if (opts.provide) {
        this.progress.start(
          `Providing module ${display(name)} to ${chalk.blue(opts.provide)}`,
        );

        if (opts.provide === "root") {
          const import_path = "./" + path.replace(".ts", ".js");
          await ProvideInRoot(this.project, m_name, [
            {
              modules: [m_name],
              path: import_path,
            },
          ]);
        } else {
          const module_path = this.project.src_path(opts.provide);
          const module_folder = join(module_path, "..");
          const relative_path = relative(module_folder, abs_path);
          const import_path = relative_path.replace(".ts", ".js");

          await ProvideInModule(this.project, module_path, m_name, [
            {
              modules: [m_name],
              path: import_path,
            },
          ]);
        }

        this.progress.succeed(
          `Module ${display(name)} provided to ${chalk.blue(opts.provide)}`,
        );
      }

      return { name: m_name, path };
    } catch (error) {
      this.progress.fail("Failed to add module");
      throwError(error as string, true);
    }
  }

  async router(name: string): Promise<GeneratorResult | undefined> {
    const r_name = name.capitalize() + "Router";
    const path = join("routers", name + ".router.ts");
    try {
      this.progress.start(`Adding router ${display(name)}`);

      this.progress.succeed(`Router ${display(name)} added`);
      fileAdded(`${path}\n`);

      return { name: r_name, path };
    } catch (error) {
      this.progress.fail("Failed to add router");
      throwError(error as string, true);
    }
  }

  async guard(name: string): Promise<GeneratorResult | undefined> {
    const g_name = name.capitalize() + "Guard";
    const path = join("services", "guards", name + ".guard.ts");

    try {
      this.progress.start(`Adding guard ${display(name)}`);

      this.progress.succeed(`Guard ${display(name)} added`);
      fileAdded(`${path}\n`);

      return { name: g_name, path };
    } catch (error) {
      this.progress.fail("Failed to add guard");
      throwError(error as string, true);
    }
  }

  async service(name: string): Promise<GeneratorResult | undefined> {
    const s_name = name.capitalize() + "Service";
    const path = join("services", name + ".service.ts");

    try {
      this.progress.start(`Adding service ${display(name)}`);

      this.progress.succeed(`Service ${display(name)} added`);
      fileAdded(`${path}\n`);

      return { name: s_name, path };
    } catch (error) {
      this.progress.fail("Failed to add service");
      throwError(error as string, true);
    }
  }

  async view(name: string): Promise<GeneratorResult | undefined> {
    const v_name = name.capitalize() + "View";
    const path = join("views", name + ".view.ts");

    try {
      this.progress.start(`Adding view ${display(name)}`);

      this.progress.succeed(`View ${display(name)} added`);
      fileAdded(`${path}\n`);

      return { name: v_name, path };
    } catch (error) {
      this.progress.fail("Failed to add view");
      throwError(error as string, true);
    }
  }

  async model(name: string): Promise<GeneratorResult | undefined> {
    const m_name = name.capitalize();
    const path = join("models", name + ".model.ts");

    try {
      this.progress.start(`Adding model ${display(name)}`);

      this.progress.succeed(`Model ${display(name)} added`);
      fileAdded(`${path}\n`);

      return { name: m_name, path };
    } catch (error) {
      this.progress.fail("Failed to add model");
      throwError(error as string, true);
    }
  }

  async crud(name: string): Promise<GeneratorResult[] | undefined> {
    try {
      this.progress.start(`Adding model, service, view and router for ${name}`);

      const model = await this.model(name);
      const service = await this.service(name);
      const view = await this.view(name);
      const router = await this.router(name);

      const res = [model, service, view, router].filter(
        Boolean,
      ) as GeneratorResult[];

      this.progress.succeed(`Added ${display(name)}:`);
      return res;
    } catch (error) {
      this.progress.fail(`Failed to add ${display(name)}`);
      throwError(error as string, true);
    }
  }
}

function display(name: string) {
  return chalk.magenta(name.capitalize());
}
