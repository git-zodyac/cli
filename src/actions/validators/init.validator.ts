import { z } from "zod";

export const zProjectName = z
  .string()
  .min(3, "Project name must be at least 3 characters long")
  .regex(
    /^[a-zA-Z_-]{1,255}$/i,
    "Project name must be alphabetic, underscore, or hyphen",
  );
