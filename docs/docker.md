# Docker Hosting

Run the full murl stack — database, API and web UI — with one command.

## Overview

`docker-compose.yml` at the repo root defines three containers:

| Container    | Image                          | Role                                                       |
| ------------ | ------------------------------ | ---------------------------------------------------------- |
| `postgres`   | `postgres:17-alpine`           | Stores URL mappings. Data lives in a named volume.          |
| `service`    | built from `packages/service`  | The Hono API: `POST /shorten`, `GET /:code`, `GET /health`. |
| `web-client` | built from `packages/web-client` | SolidJS SPA built with Vite, served by nginx.             |

`packages/cli-client` is **not** containerized. It is a published npm binary
(`murl-cli`) that runs on your machine and talks to the service over HTTP.

## Prerequisites

- Docker Engine 24+ with Compose v2 (`docker compose version`)
- No local Bun or Node install required — everything builds inside the images

## Setup

```bash
cp .env.example .env
# edit .env — at minimum change POSTGRES_PASSWORD and API_TOKEN
docker compose up -d --build
```

Then open <http://localhost:4000>.

## Configuration

All variables are read from `.env` at the repo root.

| Variable                       | Used by            | Required | Default                 | Notes                                                                  |
| ------------------------------ | ------------------ | -------- | ----------------------- | ---------------------------------------------------------------------- |
| `POSTGRES_USER`                | postgres, service  | yes      | `murl`                  | Also used to build `DATABASE_URL`.                                     |
| `POSTGRES_PASSWORD`            | postgres, service  | yes      | `change-me`             | A literal `$` must be written `$$` — Compose interpolates `.env`.      |
| `POSTGRES_DB`                  | postgres, service  | yes      | `murl`                  | Database name.                                                         |
| `DATABASE_URL`                 | service (runtime)  | derived  | —                       | Built in `docker-compose.yml` from the three above. Do not set in `.env`. |
| `SERVICE_PORT`                 | compose            | no       | `3000`                  | Host port published for the API.                                       |
| `WEB_PORT`                     | compose            | no       | `4000`                  | Host port published for the web UI.                                    |
| `API_TOKEN_MIDDLEWARE_ENABLED` | service (runtime)  | no       | `true`                  | Auth is on unless this is **exactly** `false`. Any other value enables it. |
| `API_TOKEN`                    | service (runtime)  | if above | `change-me`             | Bearer token for `POST /shorten`. Service exits on boot if auth is on and this is unset. |
| `BASE_URL`                     | service (runtime)  | no       | `http://localhost:3000` | Origin used to render `shortUrl`. Must match `SERVICE_PORT`.           |
| `ALLOWED_ORIGIN`               | service (runtime)  | **yes**  | `http://localhost:4000` | CORS allowlist. Must be the **web client's** origin. Service exits if unset. |
| `VITE_SERVICE_URL`             | web-client (**build**) | no   | `http://localhost:3000` | **Baked into the JS bundle at build time.** Changing it requires a rebuild. |

### The three URL variables must agree

- `VITE_SERVICE_URL` → where the browser sends API requests → the **service** origin
- `BASE_URL` → what short links point at → the **service** origin
- `ALLOWED_ORIGIN` → whose requests the API accepts → the **web client** origin

So changing `SERVICE_PORT` means also changing `BASE_URL` and `VITE_SERVICE_URL`
(plus a rebuild); changing `WEB_PORT` means also changing `ALLOWED_ORIGIN`.

## Startup

```bash
docker compose up -d --build     # build and start
docker compose ps                # all three should read "healthy"
docker compose logs -f service   # follow API logs
docker compose down              # stop, keep data
docker compose down -v           # stop and DELETE the database volume
```

After changing `VITE_SERVICE_URL`, rebuild the web image or the browser will
keep calling the old address:

```bash
docker compose build web-client && docker compose up -d
```

## Usage

Open <http://localhost:4000>, paste your `API_TOKEN` into the form (it is sent
per-request and never baked into the image) and shorten a URL.

The equivalent over curl:

```bash
# create a short code
curl -sX POST http://localhost:3000/shorten \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $API_TOKEN" \
  -d '{"url":"https://example.com"}'
# => {"code":"MkWO74","shortUrl":"http://localhost:3000/MkWO74"}

# follow it
curl -I http://localhost:3000/MkWO74
# => 302, Location: https://example.com
```

Point the CLI at the containerized service:

```bash
npm install -g murl-cli
murl config          # service URL http://localhost:3000, then the API token
murl "https://example.com"
```

## Networking

Compose puts all three containers on a default bridge network where they reach
each other by **service name**. Your browser and CLI run on the host and reach
them only through **published ports**.

| From                | To         | Address                 |
| ------------------- | ---------- | ----------------------- |
| `service` container | postgres   | `postgres:5432`         |
| `web-client` container | service | `service:3000`          |
| Host / browser      | service    | `http://localhost:3000` |
| Host / browser      | web UI     | `http://localhost:4000` |

This is why `VITE_SERVICE_URL` must be `http://localhost:3000` and never
`http://service:3000` — that hostname does not resolve outside the network, and
the code runs in your browser.

Postgres is deliberately **not** published. Uncomment the `ports` block in
`docker-compose.yml` only if you need to inspect it from the host.

## Volumes

The named volume `murl-postgres-data` is mounted at `/var/lib/postgresql/data`
and survives `docker compose down`. Only `docker compose down -v` removes it.

The schema is created on service boot by `packages/service/src/db.ts`
(`CREATE TABLE IF NOT EXISTS urls`), so there is no migration step — and, for
now, no migration tooling if the schema ever changes.

Backup and restore:

```bash
docker compose exec postgres pg_dump -U murl murl > murl-backup.sql
cat murl-backup.sql | docker compose exec -T postgres psql -U murl -d murl
```

## Deployment notes

- **Pin your tags.** The compose file pins `postgres:17-alpine`, `oven/bun:1.3.6-slim`
  and `nginx:1.27-alpine`. Keep them pinned; bump deliberately.
- **Cross-architecture builds.** Building on Apple Silicon for an x86 host needs
  an explicit platform:
  ```bash
  docker buildx build --platform linux/amd64 -f packages/service/Dockerfile -t murl-service:latest .
  ```
- **Reverse proxy / TLS.** In production put nginx, Caddy or Traefik in front and
  route `/` to the web client with `/shorten` and `/:code` to the service. Then
  `BASE_URL` and `VITE_SERVICE_URL` both become your public `https://` origin and
  `ALLOWED_ORIGIN` becomes same-origin. Short links live on the *service* origin,
  so a single-origin proxy is what makes them look clean.
- **Managed Postgres.** Delete the `postgres` service and set `DATABASE_URL`
  directly. Hosted providers usually require `?sslmode=require` — the opposite of
  the bundled Postgres, which serves plaintext and will fail the TLS handshake if
  you add it.
- **Secrets.** `.env` is gitignored. For real deployments prefer Docker secrets or
  your orchestrator's secret store over a file on disk.
- **Resilience.** All services use `restart: unless-stopped`, and `service` waits
  on a Postgres healthcheck because `db.ts` connects at import time. Consider
  adding `deploy.resources.limits` for memory caps.
- The service runs as the non-root `bun` user. For a fully rootless web tier, swap
  `nginx:1.27-alpine` for `nginxinc/nginx-unprivileged:alpine`, change `listen 80`
  to `listen 8080` in `packages/web-client/nginx.conf`, and map `WEB_PORT` to 8080.

## Troubleshooting

| Symptom                                                | Cause and fix                                                                                       |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `service` exits immediately, log names `ALLOWED_ORIGIN` | It is required. Set it in `.env`.                                                                    |
| `service` exits, log names `API_TOKEN`                  | Auth is enabled without a token. Set `API_TOKEN`, or set `API_TOKEN_MIDDLEWARE_ENABLED=false`.       |
| `service` restarts a few times on first boot            | Normal if Postgres is still initializing; `depends_on` + `restart` resolve it. Persisting → check `docker compose logs postgres`. |
| CORS error in the browser console                       | `ALLOWED_ORIGIN` must equal the web UI origin exactly — no trailing slash, no path.                  |
| Web UI still calls the old API address after a port change | `VITE_SERVICE_URL` is baked at build time. Run `docker compose build web-client`.                 |
| Short links 404 in the browser                          | `BASE_URL` does not match the published `SERVICE_PORT`.                                             |
| TLS handshake failure against the bundled Postgres      | Remove `?sslmode=require` — the stock image serves plaintext.                                       |
| `bun install --frozen-lockfile` fails during build      | `bun.lock` is stale. Run `bun install` on the host and commit the updated lockfile.                  |
| `Cannot find package` at service startup                | Bun keeps workspace deps in `packages/<pkg>/node_modules`, not hoisted. Both trees must be copied into the runtime stage. |
| A short code stops resolving and it happens to be `health` | `GET /health` shadows that one code. Odds are ~1 in 10^11; generate a new link.                   |

## Validating a change

```bash
docker compose config          # YAML + interpolation
docker compose build --no-cache # proves no dependence on host node_modules
docker compose up -d
docker compose ps              # all three healthy
curl -fsS http://localhost:3000/health
curl -sI http://localhost:4000/deep/route   # 200 → SPA fallback works
```
