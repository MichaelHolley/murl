import type { Component } from 'solid-js';

const Footer: Component = () => (
  <footer class="border-t-2 border-border mt-12 px-6 py-4">
    <div class="mx-auto max-w-3xl flex justify-between items-center">
      <span class="text-[10px] text-muted uppercase tracking-widest">MURL / SELF-HOSTED</span>
      <span class="text-[10px] text-muted uppercase tracking-widest">POST → /shorten</span>
    </div>
  </footer>
);

export default Footer;
