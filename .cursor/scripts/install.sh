#!/usr/bin/env bash
# Repository bootstrap: refresh Node dependencies after checkout.
# Docker, the Supabase CLI and the Supabase container images are part of the
# base snapshot, so they are not reinstalled here.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

echo "[install] Installing Node dependencies (npm ci)..."
npm ci

echo "[install] Done."
