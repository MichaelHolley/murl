# Docker hosting

Docker Compose runs the web client, service, and Postgres database together. The client and service images build independently from their package directories.

## Setup

Copy the example environment file and replace both placeholder secrets:

```bash
cp .env.example .env
```

Start the stack:

```bash
docker compose up --build -d
```

The web client is available at [http://localhost:8080](http://localhost:8080), and the service at [http://localhost:3000](http://localhost:3000).

Stop the containers with `docker compose down`. Add `--volumes` to also delete the Postgres data.

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `POSTGRES_PASSWORD` | required | Password for the Compose-managed Postgres user. |
| `API_TOKEN` | — | Bearer token for creating short URLs. Required when authentication is enabled. |
| `API_TOKEN_MIDDLEWARE_ENABLED` | `true` | Set to `false` to allow unauthenticated URL creation. |
| `BASE_URL` | `http://localhost:3000` | Public service URL used by the client and in generated short URLs. |
| `CLIENT_URL` | `http://localhost:8080` | Public client URL allowed by CORS. |
| `SERVICE_PORT` | `3000` | Host port mapped to the service. |
| `CLIENT_PORT` | `8080` | Host port mapped to the client. |

`BASE_URL` and `CLIENT_URL` must be browser-accessible public URLs, not Compose service names. Because the client is a static build, changing `BASE_URL` requires rebuilding its image with `docker compose up --build -d`.

Postgres data is stored in the `database-data` Docker volume. The database is only available to the other Compose services and is not published on the host.

For internet-facing deployments, use HTTPS URLs and place a TLS-terminating reverse proxy in front of the published client and service ports.

## Build individual images

Each image uses only its package as build context:

```bash
docker build -t murl-service packages/service
docker build \
  --build-arg VITE_SERVICE_URL=https://murl-api.example.com \
  -t murl-client packages/web-client
```

The service image requires the environment variables documented in [packages.md](packages.md#environment) when run outside Compose. The client image serves static files on port 80.
