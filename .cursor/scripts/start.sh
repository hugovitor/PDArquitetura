#!/usr/bin/env bash
# Environment "start" entrypoint: bring up the backend, then run the Next.js
# dev server in the foreground so it stays attached for the agent.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$DIR/../.." && pwd)"
cd "$REPO_ROOT"

# Start Docker + local Supabase, seed the admin user, write .env.local.
bash "$DIR/start-services.sh"

# Hand off to the dev server (stays attached as the main start process).
exec npm run dev
