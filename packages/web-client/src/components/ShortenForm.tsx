import { createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { loading, error, shortenUrl, clearError } from '../stores/murls';

const ShortenForm: Component = () => {
  const [token, setToken] = createSignal('');
  const [url, setUrl] = createSignal('');
  const [shakeError, setShakeError] = createSignal(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!token().trim() || !url().trim()) return;

    const result = await shortenUrl(token().trim(), url().trim());
    if (result) {
      setUrl('');
    } else {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    }
  }

  return (
    <>
      {/* Title block */}
      <div class="mb-10 border-2 border-border bg-card shadow-brutal-lg p-6">
        <div class="text-xs tracking-widest text-accent uppercase mb-2">[ INPUT REQUIRED ]</div>
        <h1
          class="text-3xl font-black leading-tight uppercase tracking-tight text-foreground"
          style="font-family: var(--font-sans)"
        >
          SHORTEN
          <br />
          YOUR URL
        </h1>
        <div class="mt-3 h-1 w-16 bg-accent" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} class="space-y-0">
        {/* API Token input */}
        <div class="border-2 border-b-0 border-border bg-card p-4">
          <label class="block text-[10px] tracking-widest uppercase text-accent mb-2 font-bold">
            API TOKEN
          </label>
          <input
            type="password"
            value={token()}
            onInput={(e) => setToken(e.currentTarget.value)}
            placeholder="••••••••••••••••"
            autocomplete="off"
            class="w-full bg-transparent text-foreground text-sm font-mono placeholder-muted outline-none border-b-2 border-border pb-1 focus:border-accent transition-colors"
          />
        </div>

        {/* Long URL input */}
        <div class="border-2 border-b-0 border-border bg-card p-4">
          <label class="block text-[10px] tracking-widest uppercase text-accent mb-2 font-bold">
            LONG URL
          </label>
          <input
            type="url"
            value={url()}
            onInput={(e) => setUrl(e.currentTarget.value)}
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            class="w-full bg-transparent text-foreground text-sm font-mono placeholder-muted outline-none border-b-2 border-border pb-1 focus:border-accent transition-colors"
          />
        </div>

        {/* Error display */}
        <Show when={error()}>
          <div
            class="border-2 border-b-0 border-accent bg-accent p-3 text-card text-xs font-bold tracking-wide uppercase"
            classList={{ 'animate-shake': shakeError() }}
          >
            ERROR: {error()}
            <button
              type="button"
              onClick={clearError}
              class="ml-3 underline cursor-pointer hover:no-underline"
            >
              [DISMISS]
            </button>
          </div>
        </Show>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading() || !token().trim() || !url().trim()}
          class="w-full border-2 border-border bg-foreground text-card text-sm font-black uppercase tracking-widest py-4 px-6 cursor-pointer transition-all shadow-brutal-accent hover:bg-accent hover:border-accent hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none"
          style="font-family: var(--font-sans)"
        >
          {loading() ? '[ PROCESSING... ]' : '[ SHORTEN ]'}
        </button>
      </form>
    </>
  );
};

export default ShortenForm;
