import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import type { Murl } from '../stores/murls';

interface MurlItemProps {
  murl: Murl;
  index: number;
}

const MurlItem: Component<MurlItemProps> = (props) => {
  const [copied, setCopied] = createSignal(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(props.murl.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div
      class="border-2 border-b-0 last:border-b-2 border-border bg-card p-4 animate-slide-up"
      style={`animation-delay: ${props.index * 40}ms`}
    >
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <div class="text-[10px] text-muted uppercase tracking-widest mb-1">
            #{String(props.index + 1).padStart(2, '0')} &mdash;{' '}
            {new Date(props.murl.createdAt).toLocaleTimeString()}
          </div>
          <div class="text-accent font-black text-sm tracking-tight break-all mb-1">
            {props.murl.shortUrl}
          </div>
          <div class="text-[10px] text-muted truncate">{props.murl.originalUrl}</div>
        </div>
        <button
          type="button"
          onClick={copyToClipboard}
          class="shrink-0 border-2 border-border px-3 py-1 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all shadow-brutal hover:bg-foreground hover:text-card hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          {copied() ? '✓ COPIED' : 'COPY'}
        </button>
      </div>
    </div>
  );
};

export default MurlItem;
