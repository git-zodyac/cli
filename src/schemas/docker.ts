export const dockerfile = `FROM node:18 as build-stage
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build
RUN rm -rf Dockerfile .dockerignore
RUN rm -rf tsconfig.json
RUN rm -rf src

FROM node:18-slim as production-stage
WORKDIR /app
COPY --from=build-stage /app /
EXPOSE 3000
CMD ["npm", "run", "start"]`;
