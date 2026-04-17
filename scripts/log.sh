#!/usr/bin/env bash
source "$(dirname "$0")/config.sh"

MODE="${1:-watch}"    # watch | tail

case "$MODE" in
  watch) tail -f "$DEV_LOG" ;;
  tail)  tail -20 "$DEV_LOG" ;;
  *)     echo "Unknown mode: $MODE"; exit 1 ;;
esac
