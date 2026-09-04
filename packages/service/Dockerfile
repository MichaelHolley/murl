FROM oven/bun:1.3.6-alpine AS build

WORKDIR /app

COPY package.json ./
RUN bun install --production

COPY src ./src
RUN bun run build

FROM oven/bun:1.3.6-alpine

WORKDIR /app

COPY --from=build --chown=bun:bun /app/dist ./dist

USER bun
EXPOSE 3000

CMD ["bun", "dist/index.js"]
