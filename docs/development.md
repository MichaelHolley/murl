# Development

murl is a Bun + Turborepo monorepo with three packages:

| Package | Name | Description |
| --- | --- | --- |
| `packages/service` | `murl-service` | Backend API (Hono) handling storage and redirects. |
| `packages/cli-client` | `murl-cli` | Companion CLI, published to [npm](https://www.npmjs.com/package/murl-cli). |
| `packages/web-client` | `murl-web-client` | SolidJS web dashboard. |

## Prerequisites

- [Bun](https://bun.sh/) `1.3.6+`

## Setup

```bash
bun install
```

## Run everything

```bash
bun dev          # all packages via turbo
```

Or target a single package:

```bash
bun dev:service  # backend only
bun dev:web      # web client only
bun dev:cli      # run the CLI from source
```

## Lint & format

```bash
bun lint         # oxlint
bun lint:fix
bun fmt          # oxfmt
```

Per-package setup lives in [packages.md](packages.md).
