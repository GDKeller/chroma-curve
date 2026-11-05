---
type: task
status: backlog
priority: 1
created: 2026-03-20
updated: 2026-11-04
parent: EPIC-0022
tags:
  - oklch-migration
  - color-accuracy
---

# TASK-0020: Add culori for OKLCH conversion and gamut mapping

> **Revised 2026-11-04.** This task first planned a hand-written, zero-dependency conversion pipeline from REFE-0003 as part of EPIC-0006. It now adds culori as the first step of EPIC-0022; see that epic's "Why culori" section. EPIC-0006's TASK-0021, TASK-0022 and TASK-0024 still wait on it.

Add `culori` and `@types/culori` to `app/` (culori ships no TypeScript types). culori already provides every function the original plan listed:

| Planned function | culori |
|---|---|
| `srgbToOklch` / `oklchToSrgb`, and the linear and OKLab steps | `converter("oklch")`, `converter("rgb")` |
| `srgbToHex` / `srgbToHsl` | `formatHex`, `converter("hsl")` |
| `isInSrgbGamut` | `inGamut("rgb")` |
| Max in-gamut chroma for TASK-0021 | `clampChroma(color, "oklch")` |
| Gamut mapping (not in the original plan) | `toGamut("rgb", "oklch")`, the CSS Color 4 method |

Use culori directly. Add a wrapper only for policy the app needs in one place, such as the gamut-mapping method.

## Acceptance

- `culori` and `@types/culori` in `app/package.json`.
- First use: `toOklchString()` in `app/src/lib/colors.ts` converts through culori instead of `chroma(hex).oklch()`, so knip sees the dependency in use.
- Unit test: pure grays convert to chroma 0 (chroma.js gives up to 3.9e-5).
- chroma.js stays for everything else until EPIC-0009 removes it.
