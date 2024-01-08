import { OptionalKind, SourceFileStructure } from "ts-morph";
import { ZProject } from "../../services/project.js";
import { runLint } from "../helpers/eslint.utils.js";

export type TModuleSchema = OptionalKind<SourceFileStructure>["statements"];

export async function GenerateFile(
  prj: ZProject,
  path: string,
  statements: TModuleSchema,
): Promise<void> {
  const { ts } = prj;

  const module = ts.createSourceFile(path, {
    statements,
  });

  module.formatText();
  await module.save();
  if (prj.config?.has_eslint) await runLint(prj.root);
}
