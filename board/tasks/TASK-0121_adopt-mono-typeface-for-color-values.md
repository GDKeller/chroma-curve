---
type: task
status: backlog
priority: 2
created: 2026-10-20
parent: EPIC-0020
---

# TASK-0121: Adopt a mono typeface for color values and code

Pick a deliberate monospace typeface, wire it up as a `--font-mono` token, and apply it consistently to **color values and code only**. Today mono shows up in some value readouts but not others, and it renders in whatever system mono the OS provides because no token exists.

## Rule

- **Mono:** color value strings (hex, `rgb()`, `hsl()`, `oklch()`) wherever they're displayed, the color input field, and code (export preview).
- **Not mono:** labels, controls, headings, chart axes, body copy. Those stay Acumin Pro (`font-sans`) / Unbounded (`font-display`).

## Background

- **Pre-2026-04-01:** Geist Mono was the general UI font — about 45 `font-mono` usages across labels, toggles, selects, chart axes, the About dialog, and swatch color values.
- **2026-04-01 (54a14a3, PR #4):** during the font replacement, mono was removed entirely ("there is no longer a mono font" / "you should not be using --font-mono at all for elements"). That decision was aimed at mono as the *UI voice* — NOTE-0012 had called Geist Sans/Mono "developer-tool generic" — and it also stripped mono from the swatch values. Recursive Sans Linear Static was briefly the body font (a proportional cut, never mono), then replaced by Space Grotesk and finally Acumin Pro (92750bc) over legibility concerns.
- **2026-04-05 → 04-16:** target-color work (8b4d034, f28d82b, 588e988) reintroduced `font-mono` on value readouts without restoring a token, so those elements fall back to Tailwind's default stack (`ui-monospace, SFMono-Regular, Menlo, …` → SF Mono / Consolas / Liberation Mono depending on OS).
- **2026-10-20:** reviewed the live UI and confirmed mono is right for color values specifically — they're literal strings that get pasted into code, fixed-width characters stop live-updating readouts from jittering, and values align for comparison. NOTE-0012's original suggestion ("humanist sans for body with Geist Mono retained for data") and TASK-0103 ("keep monospace for data values") point the same way.

## Current inventory (live site = `main`, verified 2026-10-20)

| Where | Visible when | Source | Mono today? |
|---|---|---|---|
| Swatch values (hex / hsl / oklch) | Always | `ColorSwatch/ColorSwatch.tsx:49-51` | **No — Acumin** |
| Hex label under target swatch | Always | `TargetSwatch/TargetSwatch.tsx:300` | Yes (system fallback) |
| Popover "TARGET #hex" readout | Popover open, no target | `TargetSwatch/TargetSwatch.tsx:74` | Yes |
| Popover color input + placeholder | Popover open | `TargetSwatch/TargetSwatch.tsx:89` | Yes |
| Popover `input → working` readout | Popover open, target set | `TargetSwatch/TargetSwatch.tsx:60` | Yes |
| TARGET row (hex / rgb / hsl / oklch) | Target set | `TargetFormats/TargetFormats.tsx:47` | Yes |
| Formula block | About dialog | `AboutButton/AboutButton.tsx:518` | Yes |
| Export code preview (`<pre>`) | Export dialog | `ExportPreview/ExportPreview.tsx:13` | Yes — via Tailwind preflight, no class |

The swatch values vs. TARGET row mismatch is the most visible inconsistency: identical kinds of strings in two different typefaces on one screen.

## Steps

1. **Choose the typeface.** Criteria: legible at 8–14px (`text-3xs` → `text-base`); clear `0`/`O` and `1`/`l`/`I` distinction; pairs with Acumin Pro and Unbounded without reading as a generic dev tool; ideally available in the existing Adobe Fonts kit (`nbx6xju`) so there's a single font source. Candidates:
   - **Recursive Mono Linear** — same family already vetted; check the `g` in `rgb(` given the 04-01 legibility concern with Recursive's letterforms.
   - **Source Code Pro** — Adobe's own, so certainly in Adobe Fonts; very legible at small sizes, but plain.
   - **IBM Plex Mono** or **DM Mono** — more character / design-tool feel; confirm Adobe Fonts availability, otherwise this adds a second font source.
   - Mock candidates on the real UI before committing (inject the font, apply to swatch values and the TARGET row at actual sizes, compare screenshots).
2. **Add the face to the Adobe Fonts kit** (manual step in Adobe Fonts) — only the weights actually used (likely 400, possibly 500).
3. **Add a `--font-mono` token** to `@theme` in `app/src/index.css`, with a `ui-monospace, monospace` fallback. Tailwind v4 maps `--default-mono-font-family` to `--font-mono`, so the export `<pre>` should pick it up automatically — verify.
4. **Apply `font-mono` to the swatch values** in `ColorSwatch.tsx` (hex, hsl, oklch lines). Leave the swatch label (`grey-N`) in Acumin.
5. **Keep the existing target-color usages** — they already follow the rule. Decide whether the About formula stays mono (it's math, not a color value; either is defensible) and note the decision.
6. **Drop redundant `tabular-nums`** on mono elements (e.g. `TargetFormats`) — fixed-width already covers it.
7. **Fix stale font references:** the Typekit comment in `app/index.html:19` (still lists Recursive Sans Linear Static) and TASK-0062's acceptance line (same).
8. **Document the mono rules** so future feature work doesn't put mono back on labels, or leave values in sans. The previous drift happened because nothing written down said where mono belongs.
   - **`.claude/CLAUDE.md` → Design Tokens:** add a *Font Families* subsection next to Type Scale and Color Tokens, listing each token and when to use it. Draft:
     - `font-sans` (Acumin Pro): the default for all UI text, including labels, controls, body copy, chart axes and swatch labels (`grey-N`).
     - `font-display` (Unbounded): the app title and display headings only.
     - `font-mono` (*chosen face*): color value strings (hex, `rgb()`, `hsl()`, `oklch()`) wherever they're displayed, the color input field, and code/export output. Never labels, controls, headings or axes.
     - Numeric control readouts (`220°`, `50%`, `-36%`, `0–100`) are **not** color values. They stay in `font-sans` with `tabular-nums`.
     - Always use the token classes. Don't use a raw `font-family` or a `font-[…]` arbitrary value.
   - **`.claude/CLAUDE.md` → Aesthetic Direction → Typography:** replace the current fallback description ("No `--font-mono` token is defined…") with the three-face system, and point to the Font Families rules.
   - **About formula:** whatever step 5 decides, add it to the rules as an explicit exception or exclusion.
   - **Other docs:** `README.md` has no typography content today, so no change is needed unless a design section gets added. Stale font lists in `app/index.html` and TASK-0062 are handled in step 7. Re-run `rg -i "mono|font-family|typekit|recursive"` across the repo (excluding `.specstory/` and `board/archive/`) to catch anything new.

## Checks

- **Dense layouts:** mono is wider than Acumin. Check swatch values at high counts (`STEP_OPTIONS` goes to 48, plus "all (101)") in both row and column layouts — `oklch(0.618 0.078 264)` at `text-2xs` is the longest string. Truncate or hide lines rather than overflow.
- **Mid-tone legibility:** coordinate with TASK-0100 — mono at `text-2xs` on L30–70 swatches must stay readable.
- **No layout shift:** the TARGET row and swatch values shouldn't change width while dragging hue/saturation.

## Acceptance

- One `--font-mono` token in `@theme`; no component hardcodes a mono font family.
- Every displayed color value string and the export preview render in the chosen face; no labels, controls, headings, or axes do.
- Swatch values and TARGET row use the same typeface.
- Font loads from the Adobe Fonts kit (or a documented second source) with no 404s; `index.html` comment and TASK-0062 list the actual families.
- `.claude/CLAUDE.md` documents all three font tokens and the mono rules: what is mono, what is explicitly not (control readouts, swatch labels, labels/headings/axes), the About formula decision, and token-only usage. The Typography line describes the shipped system, not a fallback.
- Dense swatch layouts (24 / 48 / all) show no overflow.

## Related

- TASK-0103 — Evaluate refined typography (body font + radii); already assumes mono for data values
- TASK-0100 — Swatch-label legibility on mid-tone backgrounds
- TASK-0062 — Astro font port (font list needs updating once this lands)
- TASK-0114 — HSL/RGB output spacing (changes the strings this typeface renders)
- TASK-0082 — Highlight active copy format on swatches
