---
type: task
status: backlog
priority: 2
created: 2026-10-30
parent: EPIC-0021
---

# TASK-0129: Document why the Cloudflare account ID lives in the deploy script

The root `package.json` `deploy` script sets `CLOUDFLARE_ACCOUNT_ID=2c69d8c9…` inline. Nothing explains why, so someone tidying up is likely to move it back into `wrangler.jsonc`, which breaks deploys.

## Background

- The Wrangler login can see two Cloudflare accounts. Without a pinned account, `wrangler pages deploy` fails in non-interactive mode with "More than one account available but unable to select one in non-interactive mode".
- PR #7 (b576dc1) pinned it with `account_id` in `wrangler.jsonc`. That PR only checked `wrangler pages project list`; it never ran a deploy.
- `wrangler pages deploy` validates the config before doing anything and rejects the key: `Configuration file for Pages projects does not support "account_id"`. Confirmed on Wrangler 4.78.0 and 4.156.0 (the latest) on 2026-10-30, so upgrading doesn't help.
- The fix moved the ID to `CLOUDFLARE_ACCOUNT_ID` in the `deploy` script. Wrangler reads it for every command, and the 2026-10-30 production deploy used it.

## Scope

- Add a JSONC comment to `wrangler.jsonc`. It should say that `account_id` is not allowed in a Pages config and point to the `deploy` script.
- Update the `npm run deploy` line, or the Deployment bullet, in `.claude/CLAUDE.md` to mention the account pin and why it lives in the script.

## Acceptance

- Someone reading either `wrangler.jsonc` or CLAUDE.md learns where the account ID is set and why it can't be in the config.
- The account ID is still set in exactly one place.

## Related

- TASK-0070: Cloudflare Pages config for the Astro `dist/` output. Keep the pin when that config changes.
