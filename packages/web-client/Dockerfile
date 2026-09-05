FROM oven/bun:1.3.6-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/cli-client/package.json packages/cli-client/
COPY packages/service/package.json packages/service/
COPY packages/web-client/package.json packages/web-client/
RUN bun install --frozen-lockfile

COPY packages/web-client packages/web-client
RUN bun run --cwd packages/web-client build

FROM nginx:1.29-alpine

ENV MURL_SERVICE_URL=http://service:3000
# Populates NGINX_LOCAL_RESOLVERS from /etc/resolv.conf for the template.
ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1

COPY --from=build /app/packages/web-client/dist /usr/share/nginx/html
COPY packages/web-client/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80
