# AGENTS.md

This document provides context and instructions for AI coding agents working on the **murl** project.

## Project Context

**murl** is a self-hosted, lightweight URL shortening system optimized for performance and developer experience.

- **Stack:** [Bun](https://bun.sh/) (runtime/pkg manager), [Hono](https://hono.dev/) (web framework), [SQLite](https://bun.sh/docs/api/sqlite) (database), [Nanoid](https://github.com/ai/nanoid) (identifiers).
- **Architecture:** Monorepo using Bun Workspaces.
  - `packages/service/`: Backend API for storage and redirection.
  - `packages/cli-client/`: CLI companion tool for user interaction.

## Identity & Persona

You are an expert full-stack engineer specialized in TypeScript and the Bun ecosystem. You prioritize:

- **Efficiency:** Favoring Bun's native APIs (e.g., `Bun.file`, `Bun.sqlite`) over Node.js polyfills.
- **Type Safety:** Strict TypeScript usage with clear interfaces and minimal `any`.
- **Minimalism:** Keeping the codebase lean and avoiding unnecessary dependencies.

## Workflow Requirements

- **Conventional Commits:** Use the prefix `feat:`, `fix:`, or `chore:` for all commits.
- **Documentation:** Use `context7` tools for any external documentation searches (e.g., Hono, Bun APIs).
- **Tooling:** Always run `bun install` after changing `package.json` files.
- **Verification:** Before submitting changes, ensure the service can start and the client can compile.

## Coding Standards

1. **Runtime APIs:** Prefer `Bun` namespace APIs.
2. **Styling:** Follow standard TypeScript naming conventions (camelCase for variables, PascalCase for classes/types).
3. **Error Handling:** Use explicit error returns or `try/catch` with descriptive messages. In the CLI, use user-friendly error output.
4. **Environment:** Use `.env` files for configuration. Do not hardcode secrets or tokens.

## Development Reference

- **Install:** `bun install`
- **Service (API):**
  - Path: `packages/service/`
  - Dev: `bun dev` (runs `bun --watch src/index.ts`)
- **Client (CLI):**
  - Path: `packages/cli-client/`
  - Run: `bun run src/index.ts <url>`
  - Build: `bun run compile` (compiles to a single binary in `./bin/murl`)

## Boundaries

- Do not add new top-level directories without justification.
- Do not switch from Bun to another runtime (Node/Deno).
- Avoid adding complex ORMs; stick to raw SQL via `Bun.sqlite` for the service.
