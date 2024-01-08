import { z } from "zod";

export const zGenerate = z.enum(
  ["module", "router", "guard", "service", "view", "crud", "model"],
  {
    invalid_type_error: "Unknown module type",
  },
);
export type GenerateType = z.infer<typeof zGenerate>;

export const zModuleName = z
  .string()
  .min(3, "Module name should be at least 3 characters long")
  .regex(/^[A-z][A-z]*$/, "Module name shoud be alphabetic");
