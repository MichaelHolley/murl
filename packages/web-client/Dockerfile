FROM oven/bun:1.3.6-alpine AS build

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .
RUN bun run build

FROM nginx:1.29-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
