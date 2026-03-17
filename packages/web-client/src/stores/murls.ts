import { createSignal } from 'solid-js';

export interface Murl {
  code: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: number;
}

export interface ShortenResult {
  code: string;
  shortUrl: string;
}

const [murls, setMurls] = createSignal<Murl[]>([]);
const [loading, setLoading] = createSignal(false);
const [error, setError] = createSignal<string | null>(null);

const DEFAULT_SERVICE_URL = import.meta.env.VITE_SERVICE_URL ?? 'http://localhost:3000';

export async function shortenUrl(
  apiToken: string,
  url: string,
  serviceUrl: string = DEFAULT_SERVICE_URL,
): Promise<ShortenResult | null> {
  setLoading(true);
  setError(null);

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (apiToken.trim()) {
      headers.Authorization = `Bearer ${apiToken.trim()}`;
    }

    const response = await fetch(`${serviceUrl}/shorten`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const text = await response.text();

      if (!text.trim()) {
        throw new Error(`Request failed: ${response.status}`);
      }

      try {
        const data = JSON.parse(text) as { error?: string; message?: string };
        throw new Error(data.error ?? data.message ?? `Request failed: ${response.status}`);
      } catch {
        throw new Error(text);
      }
    }

    const result: ShortenResult = await response.json();

    const murl: Murl = {
      code: result.code,
      shortUrl: result.shortUrl,
      originalUrl: url,
      createdAt: Date.now(),
    };

    setMurls((prev) => [murl, ...prev]);
    return result;
  } catch (e: Error | unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    setError(message);
    return null;
  } finally {
    setLoading(false);
  }
}

export function clearError() {
  setError(null);
}

export { murls, loading, error };
