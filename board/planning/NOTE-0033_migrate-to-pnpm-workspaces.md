---
type: note
status: inbox
created: 2026-04-17
---

# Migrate to pnpm + workspaces

Convert the repo from npm (single `app/` package, root-as-passthrough) to pnpm with a declared workspace. Small change, big payoff — unblocks future sibling packages (`site/`, `api/`, shared `tokens/`) without restructure, replaces awkward `npm run --prefix app` with first-class `pnpm --filter app` syntax, and gives us a single hoisted store with a deterministic lockfile.

## Why pnpm (not npm workspaces)

- **Strict by default.** pnpm doesn't flatten `node_modules` — workspaces can't accidentally import each other's transitive deps. Matters once we add a second package.
- **Content-addressed store.** Disk-efficient across projects; faster cold installs.
- **First-class workspace CLI.** `pnpm --filter <name>`, `pnpm -r`, `pnpm -w` are ergonomic. npm's `--workspace` / `-w` works but is younger and has rougher edges around deploy tooling.
- **Global tooling precedent.** User default is npm for standalone projects; pnpm is the pragmatic upgrade when workspaces enter the picture (see EPIC-0013 which already adds `site/`).

## Current shape

- Root `package.json`: private, no deps except `wrangler`, 15+ scripts that shell into `npm run --prefix app <cmd>`.
- `app/package.json`: the actual React/Vite/TS app. Has its own `package-lock.json`.
- Shell scripts in `scripts/` call `npm run` (run-all.sh, run-sequential.sh, dev.sh).
- `wrangler.jsonc` at root governs Cloudflare Pages deploy; `deploy` script runs `npm run --prefix app build && wrangler pages deploy`.
- `.gitignore` already ignores `**/node_modules/` — no change needed.

## Target shape

```
/
├── pnpm-workspace.yaml     # packages: ['app']
├── pnpm-lock.yaml          # single unified lockfile
├── package.json            # packageManager: "pnpm@9.x", root scripts use --filter
├── app/
│   ├── package.json        # unchanged except lockfile removed
│   └── (no package-lock.json, no pnpm-lock.yaml — one lockfile at root)
└── scripts/*.sh            # use pnpm run instead of npm run
```

## Plan (adapted from previous Claude's npm draft)

### 1. Declare the workspace

Add `pnpm-workspace.yaml` at repo root:

```yaml
packages:
  - app
```

Add `packageManager` field to root `package.json` (enables Corepack pinning):

```json
{
  "packageManager": "pnpm@9.15.0"
}
```

(Pin to whatever the latest stable is at migration time.)

### 2. Clean slate

```bash
rm -rf node_modules app/node_modules
rm package-lock.json app/package-lock.json
```

### 3. Reinstall

```bash
pnpm install
```

Generates a single `pnpm-lock.yaml` at root. Commit it.

### 4. Migrate root scripts to `--filter` syntax

Replace every `npm run --prefix app <cmd>` with `pnpm --filter app run <cmd>` (or `pnpm -F app <cmd>` — shorter alias).

```json
{
  "scripts": {
    "build": "pnpm -F app build",
    "verify": "pnpm -F app verify",
    "verify:fix": "pnpm -F app verify:fix",
    "verify:strict": "pnpm -F app verify:strict",
    "deploy": "pnpm -F app build && wrangler pages deploy",
    "dev": "./scripts/dev.sh",
    "dev:app": "pnpm -F app dev",
    "format": "pnpm -F app format",
    "format:fix": "pnpm -F app format:fix",
    "knip": "pnpm -F app knip",
    "knip:fix": "pnpm -F app knip:fix",
    "lint": "pnpm -F app lint",
    "lint:fix": "pnpm -F app lint:fix",
    "log": "./scripts/log.sh watch",
    "log:tail": "./scripts/log.sh tail",
    "preview": "pnpm -F app preview",
    "status": "./scripts/status.sh",
    "stop": "./scripts/stop.sh",
    "typecheck": "pnpm -F app typecheck"
  }
}
```

### 5. Update shell scripts

- `scripts/run-all.sh` and `scripts/run-sequential.sh`: replace `npm run "$task"` with `pnpm run "$task"`. These execute inside `app/` (cwd of the invoking script), so plain `pnpm run` resolves to the app's scripts.
- `scripts/dev.sh`: `npm run dev:app` → `pnpm run dev:app`.

### 6. Verify end-to-end

- `pnpm run dev` — dev server starts on expected port
- `pnpm -F app build` — builds clean
- `pnpm run verify` — all checks pass
- `pnpm run deploy` — dry-run or trusted production deploy; wrangler picks up `app/dist` output
- Husky / git hooks (if present) still fire

### 7. Update docs

- `README.md` — any `npm install` / `npm run …` → `pnpm install` / `pnpm run …`
- `.claude/CLAUDE.md` — Commands section references `npm run …`; switch to `pnpm`.
- Any board docs referencing npm commands (e.g., TASK-0060 explicitly uses `npm create astro@latest` — scope creep; leave untouched unless we're also converting in-flight work).

## Gotchas

1. **`packageManager` + Corepack.** With `packageManager: pnpm@x.y.z` set, Corepack-aware environments (Node 16.10+ by default) will refuse to run mismatched pnpm versions. Good for determinism; mildly annoying on machines without Corepack enabled (`corepack enable` fixes it). CI should enable Corepack explicitly.
2. **Cloudflare Pages build.** CF Pages detects the package manager from `packageManager` + lockfile automatically. Verify the build config (`wrangler pages deploy` runs locally, but CF Pages CI may run its own install). Check Pages project settings after first pnpm-based deploy.
3. **pnpm's strict node_modules.** If anything in `app/` transitively relied on npm's flat hoisting (importing a package not listed as a direct dep), it will break. Typecheck + lint + build should catch it; if not, `pnpm install --shamefully-hoist` is the escape hatch but don't reach for it unless forced.
4. **Editor tooling.** Some ESLint/TypeScript plugins resolve deps via `node_modules` lookup. pnpm's symlink layout is well-supported by modern tooling (ESLint 9+, TS 5+, VSCode) but a window reload may be needed after the switch.
5. **Husky / lint-staged.** Not currently installed, but if added later they must live in root and reference workspace scripts via `pnpm -F`.
6. **`.nvmrc` / `engines`.** Orthogonal to this migration but mentioned in NOTE-0030 — tackle separately or bundle as cleanup at the end.

## Out of scope

- Splitting `app/` into sub-packages (`tokens/`, `ui/`, etc.) — premature until there's a second consumer.
- Adding the Astro `site/` package (EPIC-0013 territory). This migration *enables* that without duplicating lockfiles; the actual addition happens in that epic.
- CI config changes beyond what's required for pnpm to install (e.g., Cloudflare Pages build command). Any GitHub Actions / other CI that currently calls `npm` will need a one-line swap — covered by the docs-and-scripts task but worth a scan.

## References

- EPIC-0013 — adds `site/` (Astro). Will benefit from workspaces landing first.
- NOTE-0030 — mentions `.nvmrc` / `engines` addition; adjacent cleanup opportunity.
