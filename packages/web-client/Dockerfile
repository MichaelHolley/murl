# Build from the repo root: `docker build -f packages/web-client/Dockerfile .`
# See packages/service/Dockerfile for why the context must be the root.

FROM oven/bun:1.3.6-slim AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY packages/service/package.json packages/service/
COPY packages/web-client/package.json packages/web-client/
COPY packages/cli-client/package.json packages/cli-client/

# No --production: vite, vite-plugin-solid, tailwind and typescript are devDependencies
RUN bun install --frozen-lockfile

# Vite inlines this into the emitted bundle, so it is fixed at image build time
# and cannot be changed by a runtime `environment:` entry. Changing it requires
# `docker compose build web-client`.
ARG VITE_SERVICE_URL=http://localhost:3000
ENV VITE_SERVICE_URL=$VITE_SERVICE_URL

COPY packages/web-client packages/web-client
WORKDIR /app/packages/web-client
RUN bun run build

FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/packages/web-client/dist /usr/share/nginx/html
COPY packages/web-client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
  CMD wget -qO- http://127.0.0.1/health || exit 1
