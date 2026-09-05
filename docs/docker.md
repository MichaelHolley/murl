# Docker hosting

Docker Compose runs the web client, service, and Postgres database together using images published to GitHub Container Registry. Add `--build` to any `docker compose` command to build them from source instead.

## Setup

Edit `docker-compose.yml` and replace the database password and API token placeholders. The database password must match in `POSTGRES_PASSWORD` and `DATABASE_URL`.

Start the stack:

```bash
docker compose up -d
```

The web client is available at [http://localhost:8080](http://localhost:8080), and the service at [http://localhost:3000](http://localhost:3000).

Stop the containers with `docker compose down`. Add `--volumes` to also delete the Postgres data.

## Configuration

| Compose value | Default | Description |
| --- | --- | --- |
| `POSTGRES_PASSWORD` | placeholder | Password for the Compose-managed Postgres user. |
| `API_TOKEN` | placeholder | Bearer token for creating short URLs. Required when authentication is enabled. |
| `API_TOKEN_MIDDLEWARE_ENABLED` | `true` | Set to `false` to allow unauthenticated URL creation. |
| `BASE_URL` | `http://localhost:3000` | Public service URL used in generated short URLs. |
| `ALLOWED_ORIGIN` | `http://localhost:8080` | Public client URL allowed by CORS. |
| `MURL_SERVICE_URL` | `http://service:3000` | Upstream the client's nginx proxies `/api` to. |
| Service port | `3000` | Host port mapped to the service. |
| Client port | `8080` | Host port mapped to the client. |

`BASE_URL` and `ALLOWED_ORIGIN` must be browser-accessible public URLs, not Compose service names. The web client sends API requests to its own `/api` path, which nginx proxies to the service over the Compose network.

Postgres data is stored in the `database-data` Docker volume. The database is only available to the other Compose services and is not published on the host.

For internet-facing deployments, use HTTPS URLs and place a TLS-terminating reverse proxy in front of the published client and service ports.

## Build individual images

Both images build from the repository root so they can install against the workspace lockfile:

```bash
docker build -f packages/service/Dockerfile -t murl-service .
docker build -f packages/web-client/Dockerfile -t murl-web-client .
```

The service image requires the environment variables documented in [packages.md](packages.md#environment) when run outside Compose. The client image serves static files on port 80 and proxies `/api` to `MURL_SERVICE_URL`; set that variable to point it at a service outside Compose.
