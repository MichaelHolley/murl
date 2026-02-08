import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("MURL - Minimal URL Shortener"));

export default {
  port: 3000,
  fetch: app.fetch,
};
