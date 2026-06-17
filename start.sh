#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Load nvm so Node 22 is available in screen sessions
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 22 --silent 2>/dev/null || true

# Kill existing screens if already running
screen -S coffee-web -X quit 2>/dev/null || true
screen -S coffee-tunnel -X quit 2>/dev/null || true

echo "→ Starting Next.js dev server..."
screen -dmS coffee-web bash -c 'export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22 --silent; cd "'"$(pwd)"'" && ./run.sh dev'

echo "→ Starting Cloudflare tunnel..."
screen -dmS coffee-tunnel cloudflared tunnel run coffee-tunnel

echo ""
echo "Running! Attach with:"
echo "  screen -r coffee-web     (Next.js)"
echo "  screen -r coffee-tunnel  (Cloudflare)"
echo ""
echo "Detach from a screen with Ctrl+A then D."
