#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-3000}"

# Load Node via nvm if available
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  nvm use 22 --silent >/dev/null 2>&1 || true
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install --no-audit --no-fund
fi

if [ ! -f .env.local ]; then
  echo "Creating .env.local..."
  SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"

  cat >.env.local <<EOF
ADMIN_PASSWORD=changeme
SESSION_SECRET=${SECRET}
EOF
fi

echo "Starting noahroe.site on http://localhost:${PORT}"

exec npm run dev -- --port "$PORT"
