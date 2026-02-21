import { For } from 'solid-js';
import type { Component } from 'solid-js';
import { murls } from '../stores/murls';
import MurlItem from './MurlItem';

const MurlList: Component = () => (
  <div class="mt-12">
    <div class="text-[10px] tracking-widest uppercase text-foreground mb-4 flex items-center gap-3">
      <span class="font-bold">OUTPUT LOG</span>
      <span class="h-px flex-1 bg-foreground" />
      <span class="text-accent">
        {murls().length} ITEM{murls().length !== 1 ? 'S' : ''}
      </span>
    </div>

    <div class="space-y-0">
      <For each={murls()}>{(murl, i) => <MurlItem murl={murl} index={i()} />}</For>
    </div>
  </div>
);

export default MurlList;
