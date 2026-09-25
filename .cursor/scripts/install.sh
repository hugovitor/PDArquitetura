#!/usr/bin/env bash
# Repository bootstrap. Idempotent: safe to run on every VM start.
#
# The base snapshot already contains Docker, the Supabase CLI and the Supabase
# container images, so normally only `npm ci` runs. The ensure_* helpers below
# are self-healing fallbacks so the environment still works if it ever boots
# from a base image that lacks Docker or the Supabase CLI.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

log() { printf '\n\033[1;34m[install]\033[0m %s\n' "$*"; }

SUPABASE_CLI_VERSION="2.117.0"

ensure_docker() {
  if command -v dockerd >/dev/null 2>&1; then return; fi
  log "Installing Docker Engine (not present in base image)..."
  sudo DEBIAN_FRONTEND=noninteractive NEEDRESTART_MODE=a apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive NEEDRESTART_MODE=a apt-get install -y -qq \
    -o Dpkg::Options::=--force-confold -o Dpkg::Options::=--force-confdef \
    docker.io fuse-overlayfs uidmap
}

ensure_supabase_cli() {
  if command -v supabase >/dev/null 2>&1; then return; fi
  log "Installing Supabase CLI v${SUPABASE_CLI_VERSION} (not present in base image)..."
  local deb="/tmp/supabase_${SUPABASE_CLI_VERSION}.deb"
  curl -fsSL -o "$deb" \
    "https://github.com/supabase/cli/releases/download/v${SUPABASE_CLI_VERSION}/supabase_${SUPABASE_CLI_VERSION}_linux_amd64.deb"
  sudo dpkg -i "$deb"
  rm -f "$deb"
}

ensure_docker
ensure_supabase_cli

log "Installing Node dependencies (npm ci)..."
npm ci

log "Done."
