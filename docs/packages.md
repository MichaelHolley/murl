# Packages

murl is split into three packages. See [development.md](development.md) for monorepo setup.

## Service (`murl-service`)

Backend API built with [Hono](https://hono.dev/). Stores URL mappings in Postgres and handles redirects.

### Environment

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | yes | — | Postgres connection string. |
| `ALLOWED_ORIGIN` | yes | — | Allowed CORS origin (e.g. the web client URL). |
| `API_TOKEN` | when auth enabled | — | Bearer token required to shorten URLs. |
| `API_TOKEN_MIDDLEWARE_ENABLED` | no | `true` | Set to `false` to disable auth. |
| `BASE_URL` | no | `http://localhost:3000` | Base URL used to build short links. |

The `urls` table is created automatically on startup.

### Run

```bash
cd packages/service
bun dev
```

### API

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/shorten` | Body `{ "url": "https://..." }` → `{ code, shortUrl }`. Requires bearer auth when enabled. |
| `GET` | `/:code` | Redirects (302) to the original URL. |

### Deploy with Docker

```bash
docker build -f packages/service/Dockerfile -t murl-service .
```

See [Docker hosting](docker.md) to run the service with the web client and Postgres.

## CLI (`murl-cli`)

Shorten URLs from your terminal. Published to [npm](https://www.npmjs.com/package/murl-cli).

### Install

```bash
npm install -g murl-cli
```

Or grab the standalone binary:

```bash
curl -fsSL https://raw.githubusercontent.com/MichaelHolley/murl/main/install.sh | bash
```

Requires Node.js 20+ for the npm install.

### Usage

```bash
murl config          # set service URL and API token (runs automatically on first use)
murl config show     # print the current configuration
murl "https://example.com/some/very/long/url"
```

The API token can be left blank if the service runs with `API_TOKEN_MIDDLEWARE_ENABLED=false`. Config is stored locally via [conf](https://github.com/sindresorhus/conf).

### Develop

```bash
bun dev:cli "https://example.com"   # run from source
```

## Web Client (`murl-web-client`)

A lightweight [SolidJS](https://www.solidjs.com/) + [Vite](https://vitejs.dev/) dashboard for shortening URLs in the browser.

### Environment

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_SERVICE_URL` | `/api` | Base URL of the murl service for static deployments outside Docker. |

### Run

```bash
cd packages/web-client
bun dev            # dev server
bun run build      # production build → dist/
bun run serve      # preview the build
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, etc.).

To build its standalone image from the repository root:

```bash
docker build -f packages/web-client/Dockerfile -t murl-web-client .
```

The image serves the built client and proxies `/api` to `MURL_SERVICE_URL`, which defaults to `http://service:3000` for Compose.
