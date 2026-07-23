<h1 align="center">murl</h1>

<p align="center">
  Your own URL shortener. Self-hosted, fast, and lightweight.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/murl-cli"><img alt="npm" src="https://img.shields.io/npm/v/murl-cli?label=murl-cli"></a>
  <a href="LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-blue"></a>
</p>

---

murl lets you turn long, ugly links into short ones you control — no third-party service, no tracking, no limits. Run it on your own hardware and shorten from the terminal or a clean web dashboard.

## Features

- 🔗 **Short, shareable links** — clean 6-character codes for any URL.
- 🖥️ **Shorten from your terminal** — one command, instant short link, ready to paste.
- 🌐 **Simple web dashboard** — shorten and manage links in the browser, no setup required.
- 🏠 **Fully self-hosted** — your links, your server, your data. Nothing leaves your infrastructure.
- ⚡ **Instant redirects** — visitors land on the real page with no delay.
- 🔒 **Private by default** — protect link creation with a token, or run it open for personal use.

## Get started

Shorten your first link in seconds with the CLI:

```bash
npm install -g murl-cli
murl config
murl "https://example.com/some/very/long/url"
```

Want to run the whole thing yourself? See the docs below.

## Documentation

- [Development](docs/development.md) — monorepo setup and scripts.
- [Packages](docs/packages.md) — the service, CLI, and web client in detail.

## License

[MIT](LICENSE)
