import { spawn } from "child_process";

export async function runCommand(
  path: string,
  app: string,
  args: string[],
  options?: { stdio: "inherit" },
): Promise<true> {
  await new Promise((resolve, reject) => {
    const child = spawn(app, args, {
      cwd: path,
      stdio: options?.stdio ?? "ignore",
    });

    child.stdout?.setEncoding("utf8");
    child.stderr?.on("data", console.error);
    child.stdout?.on("data", console.log);

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(true);
      else reject(new Error(`${app} ${args[0]} failed`));
    });
  });

  return true;
}

export function getValue(
  path: string,
  app: string,
  args: string[],
): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    const child = spawn(app, args, {
      cwd: path,
    });

    let output = "";

    child.stdout!.setEncoding("utf8");
    child.stdout!.on("data", (data) => (output += data.toString()));

    child.on("close", () => resolve(output.trim()));
  });
}
