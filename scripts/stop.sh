#!/usr/bin/env bash
source "$(dirname "$0")/config.sh"

lsof -ti:"$DEV_PORT" | xargs kill 2>/dev/null \
  && echo "Dev server stopped (port $DEV_PORT)" \
  || echo "No server running on port $DEV_PORT"
