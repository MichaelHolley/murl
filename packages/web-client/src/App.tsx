import { Show } from 'solid-js';
import type { Component } from 'solid-js';
import { murls, loading } from './stores/murls';
import Header from './components/Header';
import Footer from './components/Footer';
import ShortenForm from './components/ShortenForm';
import MurlList from './components/MurlList';
import EmptyState from './components/EmptyState';

const App: Component = () => (
  <div class="min-h-screen bg-background font-mono">
    <Header />

    <main class="mx-auto max-w-3xl px-6 py-12">
      <ShortenForm />

      <Show
        when={murls().length > 0}
        fallback={
          <Show when={!loading()}>
            <EmptyState />
          </Show>
        }
      >
        <MurlList />
      </Show>
    </main>

    <Footer />
  </div>
);

export default App;
