#!/usr/bin/env bash
source "$(dirname "$0")/config.sh"

mkdir -p "$LOG_DIR"
npm run dev:app > "$DEV_LOG" 2>&1 &

echo "Dev server started on http://localhost:$DEV_PORT"
echo "Run npm run log to watch output"
