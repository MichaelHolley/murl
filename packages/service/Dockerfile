# Build from the repo root: `docker build -f packages/service/Dockerfile .`
# bun.lock is a workspace lockfile and only exists at the root, so a package-scoped
# context cannot produce a reproducible install.

FROM oven/bun:1.3.6-slim AS deps
WORKDIR /app

# Every workspace manifest is required: --frozen-lockfile validates bun.lock
# against all of them and fails if one is missing.
COPY package.json bun.lock ./
COPY packages/service/package.json packages/service/
COPY packages/web-client/package.json packages/web-client/
COPY packages/cli-client/package.json packages/cli-client/

RUN bun install --frozen-lockfile --production

FROM oven/bun:1.3.6-slim AS runtime
WORKDIR /app

# Bun does not hoist workspace dependencies to the root, so both trees are needed
COPY --from=deps --chown=bun:bun /app/node_modules ./node_modules
COPY --from=deps --chown=bun:bun /app/packages/service/node_modules ./packages/service/node_modules
COPY --chown=bun:bun packages/service/package.json packages/service/
COPY --chown=bun:bun packages/service/src packages/service/src

# Set after install so bun install still resolves the full tree above
ENV NODE_ENV=production

WORKDIR /app/packages/service
USER bun

# PORT is deliberately not defaulted here — Bun already falls back to 3000
# ($BUN_PORT ?? $PORT ?? $NODE_PORT ?? 3000) and binds 0.0.0.0.
EXPOSE 3000

# The slim image ships neither curl nor wget; bun --eval avoids an apt layer.
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=5 \
  CMD bun --eval "const r = await fetch('http://127.0.0.1:' + (process.env.PORT ?? 3000) + '/health'); process.exit(r.ok ? 0 : 1)"

# Exec form so bun is PID 1 and receives SIGTERM from `docker stop`
CMD ["bun", "run", "src/index.ts"]
