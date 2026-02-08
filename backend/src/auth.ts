import type { Context, Next } from "hono";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  const apiToken = process.env.API_TOKEN;

  if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== apiToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
};
