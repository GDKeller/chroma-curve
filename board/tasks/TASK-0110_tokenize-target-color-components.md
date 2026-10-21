---
type: task
status: backlog
priority: 2
created: 2026-05-06
updated: 2026-10-20
parent: EPIC-0014
---

# TASK-0110: Tokenize hardcoded colors in target-color components

Eliminate hardcoded color values in target-color components flagged in PR #5 review.

> **Paths refreshed 2026-10-20.** The component flatten (e3b8ab6) replaced the old `components/target/` directory with `components/TargetSwatch/`, `components/TargetFormats/`, and `components/FormatSelector/`. `ColorInput` is no longer a separate component — it is a local function inside `TargetSwatch.tsx`.

## Scope

Offenders confirmed in current code (2026-10-20):

- `FormatSelector/FormatSelector.tsx` — `btnActive` uses `text-white` → `text-text-primary` (or appropriate token).
- `TargetSwatch/TargetSwatch.tsx`, swatch trigger `boxShadow` — inline `rgba(255,255,255,0.1)` / `rgba(0,0,0,0.3)` / `rgba(255,255,255,0.15)` → token-based shadow.
- `TargetSwatch/TargetSwatch.tsx`, `ColorInput` invalid state — `border-red-500`. No error/invalid token exists in `@theme` yet; add a semantic one (e.g. `--color-border-invalid`) rather than reaching for a Tailwind palette color.
- `TargetSwatch/TargetSwatch.tsx`, canvas crosshair — `ctx.strokeStyle = "rgba(0,0,0,0.4)"`. Canvas can't consume Tailwind classes; read the token via `getComputedStyle` or a shared constant sourced from the theme.
- `TargetSwatch/TargetSwatch.tsx`, active-ring color `hsl(${targetHue}, 80%, 55%)` — derived from the user's hue, so arguably content rather than chrome. Decide explicitly and leave a comment either way.

## Acceptance

- Grep for `text-white`, `rgba(`, `-red-`, hex literals, and hsl literals across `app/src/components/{TargetSwatch,TargetFormats,FormatSelector}/**` returns no unexplained offenders.
- Visual parity preserved (or intentional improvement noted).

## Source

- NOTE-0030
