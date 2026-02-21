import type { Component } from 'solid-js';

const EmptyState: Component = () => (
  <div class="mt-12 border-2 border-dashed border-muted p-8 text-center">
    <div class="text-muted text-xs uppercase tracking-widest">
      — SHORTENED URLS WILL APPEAR HERE —
    </div>
  </div>
);

export default EmptyState;
