#!/usr/bin/env bash
# Runs all passed args regardless of exit status

set +e # Continue on non-zero exit
failed=0
for task in "$@"; do
  npm run "$task" || failed=1
done
exit $failed
