# murl

A self-hosted, lightweight URL shortening system designed for efficiency and ease of use.

## Project Structure

- `packages/service/` (`murl-service`): The backend API handling storage and redirection logic.
- `packages/cli-client/` ([`murl-cli`](https://www.npmjs.com/package/murl-cli)): A companion CLI tool for interacting with the service, published to npm.
- `packages/web-client/` (`murl-web-client`): A lightweight SolidJS-powered web interface.

## Key Technologies

- **[Bun](https://bun.sh/)**: Runtime, package manager, and SQL driver.
- **[Hono](https://hono.dev/)**: Fast web framework for the API.
- **[SolidJS](https://www.solidjs.com/)**: Reactive UI library for the web client.
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling.
- **PostgreSQL**: Database for URL mappings.
- **Nanoid**: Short, unique, and URL-friendly identifiers.
- **TypeScript**: Type-safe development.

## Main Features

- **Efficient URL Shortening**: Generate 6-character short codes.
- **CLI Interaction**: Shorten URLs directly from your terminal.
- **Web Interface**: Simple and fast dashboard to manage URLs.
- **Secure API**: Protected by Bearer token authentication.
- **Fast Redirection**: Immediate redirects.
- **Configuration Wizard**: Easy CLI setup (`murl config`).

## Getting Started

### Installation

```bash
bun install
```

### Running the Service

```bash
cd packages/service
bun dev
```

### Using the CLI

Install globally via npm:

```bash
npm install -g murl-cli
murl "<url>"
murl config
```

Or run from source during development:

```bash
cd packages/cli-client
bun run index.ts <url>
```

### Running the Web Client

```bash
cd packages/web-client
bun dev
```

### Running with Docker

Runs the database, API and web client together:

```bash
cp .env.example .env
docker compose up -d --build
```

Web UI on <http://localhost:4000>, API on <http://localhost:3000>.
See [docs/docker.md](docs/docker.md) for configuration, networking, volumes and
deployment notes.

---

Built with Bun.
