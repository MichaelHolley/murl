# murl

A self-hosted, lightweight URL shortening system designed for efficiency and ease of use.

## Project Structure

- `packages/service/`: The backend API handling storage and redirection logic.
- `packages/client/`: A companion CLI tool for interacting with the service.

## Key Technologies

- **[Bun](https://bun.sh/)**: Runtime, package manager, and SQLite driver.
- **[Hono](https://hono.dev/)**: Fast web framework for the API.
- **SQLite**: Lightweight database for URL mappings.
- **Nanoid**: Short, unique, and URL-friendly identifiers.
- **TypeScript**: Type-safe development.

## Main Features

- **Efficient URL Shortening**: Generate 6-character short codes.
- **CLI Interaction**: Shorten URLs directly from your terminal.
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

```bash
cd packages/client
bun run src/index.ts <url>
```

---
Built with Bun.
