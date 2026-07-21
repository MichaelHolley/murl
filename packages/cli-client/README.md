# murl-cli

Command-line client for [murl](https://github.com/MichaelHolley/murl), a self-hosted, lightweight URL shortening service.

## Installation

```bash
npm install -g murl-cli
```

Requires Node.js 20 or newer.

## Usage

```bash
# configure your API token (optional) and service base URL (first run prompts automatically)
murl config

# print the current configuration without editing it
murl config show

# shorten a URL — prints the short URL to stdout
murl "https://example.com/some/very/long/url"
```

The API token can be left blank if your murl instance runs with `API_TOKEN_MIDDLEWARE_ENABLED=false` (no auth required). Configuration is stored locally via [conf](https://github.com/sindresorhus/conf); run `murl config` again at any time to update it.

## Self-hosting the service

See the [murl repository](https://github.com/MichaelHolley/murl) for running the backend service the CLI talks to.

## License

MIT
