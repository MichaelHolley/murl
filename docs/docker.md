# Docker hosting

Docker Compose runs the murl service together with its Postgres database, using an image published to Docker Hub. Add `--build` to any `docker compose` command to build it from source instead.

## Setup

Edit `docker-compose.yml` and replace the database password, API token, and allowed origin placeholders. The database password must match in `POSTGRES_PASSWORD` and `DATABASE_URL`.

Start the stack:

```bash
docker compose up -d
```

The service is available at [http://localhost:3000](http://localhost:3000). Point a web client (see [Packages](packages.md#web-client-murl-web-client)) or the [CLI](packages.md#cli-murl-cli) at it.

Stop the containers with `docker compose down`. Add `--volumes` to also delete the Postgres data.

## Configuration

| Compose value | Default | Description |
| --- | --- | --- |
| `POSTGRES_PASSWORD` | placeholder | Password for the Compose-managed Postgres user. |
| `API_TOKEN` | placeholder | Bearer token for creating short URLs. Required when authentication is enabled. |
| `API_TOKEN_MIDDLEWARE_ENABLED` | `true` | Set to `false` to allow unauthenticated URL creation. |
| `BASE_URL` | `http://localhost:3000` | Public service URL used in generated short URLs. |
| `ALLOWED_ORIGIN` | placeholder | Public URL of the client allowed by CORS. |
| Service port | `3000` | Host port mapped to the service. |

`BASE_URL` and `ALLOWED_ORIGIN` must be browser-accessible public URLs.

Postgres data is stored in the `database-data` Docker volume. The database is only available to the service and is not published on the host.

For internet-facing deployments, use HTTPS URLs and place a TLS-terminating reverse proxy in front of the published service port.

## Build the image

The image builds from the repository root so it can install against the workspace lockfile:

```bash
docker build -f packages/service/Dockerfile -t murl-service .
```

See [Packages](packages.md#environment) for the environment variables it requires when run outside Compose.
