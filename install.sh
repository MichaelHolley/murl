#!/usr/bin/env bash
set -euo pipefail

REPO="MichaelHolley/murl"
INSTALL_DIR="${INSTALL_DIR:-/usr/local/bin}"

VERSION=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
  | grep '"tag_name"' | cut -d'"' -f4)

if [[ -z "$VERSION" ]]; then
  echo "Error: Could not determine latest release version." >&2
  exit 1
fi

URL="https://github.com/${REPO}/releases/download/${VERSION}/murl"

echo "Installing murl ${VERSION}..."
curl -fsSL "$URL" -o /tmp/murl
chmod +x /tmp/murl

if [[ ! -d "$INSTALL_DIR" ]]; then
  echo "Error: Install directory ${INSTALL_DIR} does not exist." >&2
  exit 1
fi

mv /tmp/murl "${INSTALL_DIR}/murl"
echo "Installed murl ${VERSION} to ${INSTALL_DIR}/murl"
echo "Run 'murl config' to get started."
