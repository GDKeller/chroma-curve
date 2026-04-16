#!/usr/bin/env bash
source "$(dirname "$0")/config.sh"

lsof -ti:"$DEV_PORT" >/dev/null 2>&1 \
  && echo "Dev ($DEV_PORT): running" \
  || echo "Dev ($DEV_PORT): stopped"
