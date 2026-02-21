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

export async function shortenUrl(
  apiToken: string,
  url: string,
  serviceUrl: string = 'http://localhost:3000',
): Promise<ShortenResult | null> {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(`${serviceUrl}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error ?? `Request failed: ${response.status}`);
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
  } catch (e) {
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
