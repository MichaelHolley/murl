FROM oven/bun:1.3.6-alpine AS build

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

ARG VITE_SERVICE_URL=http://localhost:3000
ENV VITE_SERVICE_URL=$VITE_SERVICE_URL

RUN bun run build

FROM nginx:1.29-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
