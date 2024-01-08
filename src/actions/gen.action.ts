import { GenerateType, zModuleName } from "./validators/gen.validator.js";
import { Action } from "../utils/action/action.js";
import { Generator } from "../services/gen/gen.service.js";
import { throwError } from "../view/errors.view.js";
import { ZProject } from "../services/project.js";
import { input, select } from "@inquirer/prompts";
import { ModuleAction } from "./generate/module.action.js";
import { RouterAction } from "./generate/router.action.js";
import { GuardAction } from "./generate/guard.action.js";
import { ServiceAction } from "./generate/service.action.js";
import { ViewAction } from "./generate/view.action.js";
import { CrudAction } from "./generate/crud.action.js";
import { ModelAction } from "./generate/model.action.js";

export class Generate extends Action {
  init() {
    const gen = this.program
      .command("generate")
      .description("Generate a module")
      .alias("g");

    ModuleAction.action((name, opts) => this.module(name, opts));
    gen.addCommand(ModuleAction);

    RouterAction.action((name, opts) => this.router(name, opts));
    gen.addCommand(RouterAction);

    GuardAction.action((name) => this.guard(name));
    gen.addCommand(GuardAction);

    ServiceAction.action((name, opts) => this.service(name, opts));
    gen.addCommand(ServiceAction);

    ViewAction.action((name, opts) => this.view(name, opts));
    gen.addCommand(ViewAction);

    CrudAction.action((name) => this.crud(name));
    gen.addCommand(CrudAction);

    ModelAction.action((name) => this.model(name));
    gen.addCommand(ModelAction);

    // gen.action(() => this.execute());
  }

  async execute() {
    const type = await askType();
    if (!type) return;

    const name = await askName();
    if (!name) return;

    this[type](name);
  }

  async module(name: string, opts?: { provide?: string }) {
    console.log(opts);

    const valid = zModuleName.safeParse(name);
    if (!valid.success) {
      throwError(valid.error.errors[0].message);
      name = (await askName()) ?? "";
    }
    if (!name) return;

    const project = await ZProject.parse(this.cwd);
    if (!project) return throwError("Could not find Zodyac project");

    const worker = new Generator(project);
    await worker.module(name);
  }

  async router(name: string, opts?: { nest?: string }) {
    console.log(opts);

    const valid = zModuleName.safeParse(name);
    if (!valid.success) {
      throwError(valid.error.errors[0].message);
      name = (await askName()) ?? "";
    }
    if (!name) return;

    const project = await ZProject.parse(this.cwd);
    if (!project) return throwError("Could not find Zodyac project");

    const worker = new Generator(project);
    await worker.router(name);
  }

  async guard(name: string) {
    const valid = zModuleName.safeParse(name);
    if (!valid.success) {
      throwError(valid.error.errors[0].message);
      name = (await askName()) ?? "";
    }
    if (!name) return;

    const project = await ZProject.parse(this.cwd);
    if (!project) return throwError("Could not find Zodyac project");

    const worker = new Generator(project);
    await worker.guard(name);
  }

  async service(name: string, opts?: { skipDef?: boolean }) {
    console.log(opts);

    const valid = zModuleName.safeParse(name);
    if (!valid.success) {
      throwError(valid.error.errors[0].message);
      name = (await askName()) ?? "";
    }
    if (!name) return;

    const project = await ZProject.parse(this.cwd);
    if (!project) return throwError("Could not find Zodyac project");

    const worker = new Generator(project);
    await worker.service(name);
  }

  async view(name: string, opts?: { service?: string }) {
    console.log(opts);
    const valid = zModuleName.safeParse(name);
    if (!valid.success) {
      throwError(valid.error.errors[0].message);
      name = (await askName()) ?? "";
    }
    if (!name) return;

    const project = await ZProject.parse(this.cwd);
    if (!project) return throwError("Could not find Zodyac project");

    const worker = new Generator(project);
    await worker.view(name);
  }

  async crud(name: string) {
    const valid = zModuleName.safeParse(name);
    if (!valid.success) {
      throwError(valid.error.errors[0].message);
      name = (await askName()) ?? "";
    }
    if (!name) return;

    const project = await ZProject.parse(this.cwd);
    if (!project) return throwError("Could not find Zodyac project");

    const worker = new Generator(project);
    await worker.crud(name);
  }

  async model(name: string) {
    const valid = zModuleName.safeParse(name);
    if (!valid.success) {
      throwError(valid.error.errors[0].message);
      name = (await askName()) ?? "";
    }
    if (!name) return;

    const project = await ZProject.parse(this.cwd);
    if (!project) return throwError("Could not find Zodyac project");

    const worker = new Generator(project);
    await worker.model(name);
  }
}

async function askType(): Promise<GenerateType | undefined> {
  try {
    return await select({
      message: "What type of module would you like to generate?",
      choices: [
        {
          name: "Module",
          value: "module",
          description: "A module is an independent part of the application",
        },
        {
          name: "Router",
          value: "router",
          description: "A router is a module that handles requests",
        },
        {
          name: "Guard",
          value: "guard",
          description:
            "A guard is a module that handles request permissions, e.g. authentication",
        },
        {
          name: "Service",
          value: "service",
          description:
            "A service is a module that handles business logic, e.g. operates models",
        },
        {
          name: "View",
          value: "view",
          description: "A view is a module that forms a response",
        },
        {
          name: "Model",
          value: "model",
          description: "A model is a representation of an entity, e.g. Task",
        },
        {
          name: "Crud",
          value: "crud",
          description: "Creates model, service, router and view",
        },
      ],
    });
  } catch (error) {
    return undefined;
  }
}

async function askName() {
  try {
    return await input({
      message: "What will be the name of the module?",
      validate: (value) => {
        const valid_name = zModuleName.safeParse(value);
        if (!valid_name.success) return valid_name.error.errors[0].message;

        return true;
      },
    });
  } catch (error) {
    return undefined;
  }
}
