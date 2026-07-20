# murl-cli

Command-line client for [murl](https://github.com/MichaelHolley/murl), a self-hosted, lightweight URL shortening service.

## Installation

```bash
npm install -g murl-cli
```

Requires Node.js 20 or newer.

## Usage

```bash
# configure your API token and service base URL (first run prompts automatically)
murl config

# shorten a URL — prints the short URL to stdout
murl "https://example.com/some/very/long/url"
```

Configuration is stored locally via [conf](https://github.com/sindresorhus/conf); run `murl config` again at any time to update it.

## Self-hosting the service

See the [murl repository](https://github.com/MichaelHolley/murl) for running the backend service the CLI talks to.

## License

MIT
