import { Hono } from "hono";
import { nanoid } from "nanoid";
import { insertUrl } from "./db";
import { authMiddleware } from "./auth";

const app = new Hono();

app.get("/", (c) => c.text("MURL - Minimal URL Shortener"));

app.post("/shorten", authMiddleware, async (c) => {
  const body = await c.req.json();
  const { url } = body;

  if (!url) {
    return c.json({ error: "URL is required" }, 400);
  }

  const code = nanoid(6);
  insertUrl(code, url);

  return c.json({ code, shortUrl: `http://localhost:3000/${code}` });
});

export default {
  port: 3000,
  fetch: app.fetch,
};
