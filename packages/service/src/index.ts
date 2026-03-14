import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { cors } from 'hono/cors';
import { nanoid } from 'nanoid';
import { getUrlByCode, insertUrl } from './db';

const app = new Hono();

const API_TOKEN = process.env.API_TOKEN;
const API_TOKEN_MIDDLEWARE_ENABLED =
  process.env.API_TOKEN_MIDDLEWARE_ENABLED !== 'false';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

if (API_TOKEN_MIDDLEWARE_ENABLED && !API_TOKEN) {
  throw new Error(
    'API_TOKEN environment variable is required when API_TOKEN_MIDDLEWARE_ENABLED is true',
  );
}

if (!ALLOWED_ORIGIN) {
  throw new Error('ALLOWED_ORIGIN environment variable is required');
}

app.use('*', cors({
  origin: ALLOWED_ORIGIN,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

if (API_TOKEN_MIDDLEWARE_ENABLED) {
  app.use('/shorten', bearerAuth({ token: API_TOKEN! }));
}

app.post('/shorten', async (c) => {
  const body = await c.req.json();
  const { url } = body;

  if (!url) {
    return c.json({ error: 'URL is required' }, 400);
  }

  try {
    new URL(url);
  } catch {
    return c.json({ error: 'Invalid URL format' }, 400);
  }

  const code = nanoid(6);
  await insertUrl(code, url);

  return c.json({ code, shortUrl: `${BASE_URL}/${code}` });
});

app.get('/:code', async (c) => {
  const code = c.req.param('code');
  const result = await getUrlByCode(code);

  if (!result) {
    return c.json({ error: 'Code not found' }, 404);
  }

  return c.redirect(result.url, 302);
});

export default app;
