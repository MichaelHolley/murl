FROM oven/bun:1.3.6-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/cli-client/package.json packages/cli-client/
COPY packages/service/package.json packages/service/
COPY packages/web-client/package.json packages/web-client/
RUN bun install --frozen-lockfile --production

COPY packages/service/src packages/service/src
RUN bun run --cwd packages/service build

FROM oven/bun:1.3.6-alpine

WORKDIR /app

COPY --from=build --chown=bun:bun /app/packages/service/dist ./dist

USER bun
EXPOSE 3000

CMD ["bun", "dist/index.js"]
