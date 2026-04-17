#!/usr/bin/env bash
# Shared config for npm scripts

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$REPO_ROOT/app/.env.development.local"
[[ -f "$ENV_FILE" ]] && source "$ENV_FILE"
DEV_PORT="${PORT:-5173}"

LOG_DIR="logs"
DEV_LOG="$LOG_DIR/dev.log"
