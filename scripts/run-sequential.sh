#!/usr/bin/env bash
# Runs passed args in order, stops at first non-zero exit

set -e
for task in "$@"; do
  npm run "$task"
done
