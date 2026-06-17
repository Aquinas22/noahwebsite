#!/usr/bin/env bash
#
# run.sh — start Noah Roe's site + CMS
#
#   ./run.sh         start the dev server (hot reload)  -> http://localhost:3000
#   ./run.sh dev     same as above
#   ./run.sh prod    build, then serve the production app
#   ./run.sh build   build only
#
set -euo pipefail
cd "$(dirname "$0")"

MODE="${1:-dev}"
PORT="${PORT:-3000}"

# 1. Install dependencies on first run (or after they're cleared).
if [ ! -d node_modules ]; then
  echo "→ Installing dependencies..."
  npm install --no-audit --no-fund
fi

# 2. Make sure the admin password / session secret exist.
if [ ! -f .env.local ]; then
  echo "→ Creating .env.local (admin password: changeme — change this!)"
  SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
  printf 'ADMIN_PASSWORD=changeme\nSESSION_SECRET=%s\n' "$SECRET" > .env.local
fi

case "$MODE" in
  dev)
    echo "→ Starting dev server on http://localhost:${PORT}  (admin at /admin)"
    exec npm run dev -- --port "$PORT"
    ;;
  build)
    echo "→ Building for production..."
    exec npm run build
    ;;
  prod|start)
    echo "→ Building for production..."
    npm run build
    echo "→ Serving on http://localhost:${PORT}  (admin at /admin)"
    PORT="$PORT" exec npm run start
    ;;
  *)
    echo "Usage: ./run.sh [dev|build|prod]" >&2
    exit 1
    ;;
esac
