export const ZExtentions = {
  express: "+ Express server module (@zodyac/express-core)",
  git: "> Adds git to your project",
  docker: "> Adds Dockerfile to your project",
  eslint: "> Adds eslint to your project",
  fastify: "x Fastify server module (@zodyac/fastify-core)",
  koa: "x Koa server module (@zodyac/koa-core)",
  mongoose: "x Adds Mongoose entity support (@zodyac/mongoose-core)",
  typeorm: "x Adds TypeORM entity support (@zodyac/typeorm-core)",
} as const;

export const ZExtentionsList = Object.keys(
  ZExtentions,
) as (keyof typeof ZExtentions)[];

export function extStatus(
  desc: (typeof ZExtentions)[keyof typeof ZExtentions],
) {
  switch (desc[0]) {
    case "+":
      return "green";
    case "x":
      return "gray";
    default:
      return "blueBright";
  }
}
