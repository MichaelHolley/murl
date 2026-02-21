import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { nanoid } from 'nanoid';
import { getUrlByCode, insertUrl } from './db';

const app = new Hono();

const API_TOKEN = process.env.API_TOKEN;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

if (!API_TOKEN) {
  console.warn('Warning: API_TOKEN is not set. Authentication will fail.');
  throw new Error('API_TOKEN environment variable is required');
}

app.use('/shorten', bearerAuth({ token: API_TOKEN }));

app.post('/shorten', async (c) => {
  const body = await c.req.json();
  const { url } = body;

  if (!url) {
    return c.json({ error: 'URL is required' }, 400);
  }

  try {
    new URL(url);
  } catch (e) {
    return c.json({ error: 'Invalid URL format' }, 400);
  }

  const code = nanoid(6);
  insertUrl(code, url);

  return c.json({ code, shortUrl: `${BASE_URL}/${code}` });
});

app.get('/:code', async (c) => {
  const code = c.req.param('code');
  const result = getUrlByCode(code);

  if (!result) {
    return c.json({ error: 'Code not found' }, 404);
  }

  return c.redirect(result.url, 302);
});

export default app;
