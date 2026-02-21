import type { Component } from 'solid-js';

const Header: Component = () => (
  <header class="border-b-2 border-border bg-foreground px-6 py-4">
    <div class="mx-auto max-w-3xl flex items-baseline gap-4">
      <span
        class="text-accent text-2xl font-black tracking-tighter"
        style="font-family: var(--font-sans)"
      >
        MURL
      </span>
      <span class="text-muted text-xs tracking-widest uppercase">URL SHORTENER</span>
    </div>
  </header>
);

export default Header;
