---
type: note
status: inbox
created: 2026-04-17
---

# PR #5 review follow-ups

Non-blocker items surfaced by the multi-agent review of PR #5 (`feat/target-color-input`). Blockers B1–B4 were fixed in the PR itself; items below were explicitly deferred. Grouped by area for batched follow-up. Confidence scores and severities are as reported by the reviewers.

## Target color feature (feature-reviewer)

### `FormatSelector.tsx` — hardcoded `text-white`

- **File:** `app/src/components/FormatSelector/FormatSelector.tsx:31`
- **Severity:** Medium
- **What:** `const btnActive = "bg-surface-active text-white";` uses raw `text-white` instead of a semantic token.
- **Why it matters:** Project rule (user's saved feedback + `.claude/CLAUDE.md`) forbids hardcoded colors on text. `text-text-primary` is 98% lightness — the correct substitute.
- **Fix:** change `text-white` → `text-text-primary`.

### `TargetSwatch.tsx` — hardcoded `rgba()` in inline `boxShadow`

- **File:** `app/src/components/TargetSwatch/TargetSwatch.tsx:269-270`
- **Severity:** Medium
- **What:**
  ```tsx
  ? "0 0 0 1px rgba(255,255,255,0.1), inset 0 0 0 1px rgba(0,0,0,0.3)"
  : "0 0 0 1px rgba(255,255,255,0.15)",
  ```
  Two hardcoded `rgba()` shadow values on the swatch circle's drifted/normal states.
- **Why it matters:** Project rules prohibit `rgba(` in component styles; tokens must be used.
- **Fix:** move to Tailwind `ring-*` / `shadow-*` utilities referencing CSS variable tokens (e.g. `var(--color-border-default)`), or tokenize these as new `--color-ring-*` variables if alpha compositing is required.

### `TargetSwatch.tsx` — clear button invisible on keyboard focus

- **File:** `app/src/components/TargetSwatch/TargetSwatch.tsx:286-294`
- **Severity:** Important (a11y)
- **Confidence:** 85
- **What:** The clear-target button uses `opacity-0 group-hover:opacity-100` — it never appears for keyboard-only users.
- **Fix:** add `focus-visible:opacity-100` to the class list (and ideally a visible focus ring when it appears).

### `TargetSwatch.tsx` — canvas picker has no touch support

- **File:** `app/src/components/TargetSwatch/TargetSwatch.tsx:301-309` (and the mouse-only `useEffect` at ~231-244)
- **Severity:** Low / Nit
- **Confidence:** 80
- **What:** Only `onMouseDown` + document `mousemove`/`mouseup` are wired. No `onTouchStart`/`onTouchMove`/`onTouchEnd`. Keyboard support is now in place (B4), but touch is still missing.
- **Why it matters:** Popover works on mobile via the text input, but the 2D picker is unusable with touch.
- **Fix:** add Pointer Events (`onPointerDown`/`onPointerMove`/`onPointerUp`) which unifies mouse/touch/pen, or add touch handlers alongside the existing mouse handlers.

### `ColorInput` — input missing `aria-label`

- **File:** `app/src/components/TargetSwatch/TargetSwatch.tsx:80-92`
- **Severity:** Important (a11y)
- **Confidence:** 85
- **What:** The color input has a placeholder (`#hex, rgb(), hsl(), oklch()`) but no `aria-label`. Placeholders are not accessible names.
- **Fix:** add `aria-label="Target color"` (or similar) to the `<input>`.

### `TargetFormats.tsx` — no `aria-live` on copy feedback

- **File:** `app/src/components/TargetFormats/TargetFormats.tsx:33-51`
- **Severity:** Medium (a11y)
- **What:** Clicking a format button swaps the label text from e.g. `rgb(180, 90, 127)` to `Copied`. Screen readers get no announcement.
- **Fix:** add `aria-live="polite"` and `aria-atomic="true"` to the value `<span>` (around line 47), or wrap the format row in a live region.

### `TargetFormats.tsx` — `opacity-55` wrapper degrades contrast

- **File:** `app/src/components/TargetFormats/TargetFormats.tsx:27`
- **Severity:** Medium (contrast)
- **What:** `opacity-55` on a container dims text inside for the drifted state. `text-faint` inside a 55%-opacity wrapper on a raised surface falls well below AA.
- **Fix:** don't use container opacity to dim text. Swap to explicit dimmer text tokens for the drifted state, or reduce opacity on the background only.

### `TargetFormats.tsx` — `formatAllFormats` not memoized

- **File:** `app/src/components/TargetFormats/TargetFormats.tsx:23`
- **Severity:** Nit (perf)
- **What:** `formatAllFormats(hue, saturation)` calls chroma 4× per render. Any parent re-render triggers redundant conversions on a component visible during every palette interaction.
- **Fix:** `const formats = useMemo(() => formatAllFormats(hue, saturation), [hue, saturation]);`

### `lib/colors.ts` — oklch regex rejects slash-alpha syntax

- **File:** `app/src/lib/colors.ts:24-27`
- **Severity:** Low
- **What:** The regex `/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)/i` rejects modern CSS Color Level 4 alpha like `oklch(0.7 0.15 200 / 0.5)`. Users pasting from modern design tools get a false parse failure.
- **Fix:** extend the regex to optionally match `\s*(?:\/\s*[\d.]+%?)?\s*` before the closing paren. Ignore the alpha channel for hue/sat extraction (tool operates at fixed L=50).

### `lib/colors.ts` — HSL/RGB output missing spaces after separators

- **File:** `app/src/lib/colors.ts:69, 72`
- **Severity:** Low / Nit
- **What:** Emits `hsl(180,50%,50%)` and `rgb(180,90,127)` — no spaces after commas. Valid legacy CSS but deviates from DevTools output and the OKLCH formatter (which uses spaces). Feels rough on copy.
- **Fix:** `hsl(${hue}, ${Math.round(saturation * 100)}%, 50%)` and `rgb(${r}, ${g}, ${b})`.

## Tooling (tooling-reviewer)

### Port SSOT violation

- **Files:** `scripts/config.sh:6`, `app/vite.config.ts:9`
- **Severity:** High
- **What:** The `5173` fallback for `PORT` is duplicated in both files. The real source of truth is `app/.env.development.local`.
- **Why it matters:** User has explicit saved feedback against SSOT violations. If the default changes, two files must be updated.
- **Fix:** drop one of the fallbacks (prefer keeping the Vite default and removing from `config.sh`), or centralize in a single env read.

### ~~`scripts/config.sh` hard-requires `.env.development.local`~~ — RESOLVED in PR #5

- **File:** `scripts/config.sh:5-6`
- **Resolution:** guarded with `[[ -f "$ENV_FILE" ]] && source "$ENV_FILE"`. Smoke-tested with and without the env file.

### ~~Root `package-lock.json` has ghost `prettier-eslint` entry~~ — RESOLVED in PR #5

- **File:** root `package-lock.json`
- **Resolution:** regenerated via `npm install`. 152 ghost packages removed; 0 vulnerabilities.

### 26 auto-fixable `better-tailwindcss` warnings

- **Severity:** Low
- **What:** `npm run verify` exits 0 but emits 26 warnings across several components (canonical class simplifications like `h-4 w-4` → `size-4`, one duplicate class).
- **Fix:** `cd app && npm run lint:fix` (or equivalent).
- Files affected include: `SaturationSlider.tsx`, `SliderBase.tsx`, `TargetSwatch.tsx`, `ToggleSwitch.tsx`, and others.

### `contrast-audit.mjs` not wired into any npm script

- **File:** `scripts/contrast-audit.mjs`
- **Severity:** Low
- **What:** Script exists but no `contrast`/`audit` entry in `app/package.json` or root `package.json`.
- **Fix:** add a script entry if it's intended for CI / verify; otherwise document as a manual dev tool.

### Dead ESLint override globs

- **File:** `app/eslint.config.js:92-98`
- **Severity:** Nit
- **What:** Override includes `src/pages/**/*.astro`, `astro.config.*`, `next.config.*` — this is a React/Vite app with no Astro or Next.
- **Fix:** trim the dead globs.

### No `.nvmrc` / `engines` field

- **Severity:** Nit
- **What:** Global CLAUDE.md prefers Node ^24 LTS; `@types/node` is pinned to `^24.12.0` but there's no `.nvmrc` or `engines` constraint.
- **Fix:** add `.nvmrc` with `24` and/or `"engines": { "node": ">=24" }` to `app/package.json`.

## Design tokens (tokens-reviewer)

### CLAUDE.md token-doc drift

- **File:** `.claude/CLAUDE.md` ("Color Tokens" section)
- **Severity:** Nit
- **What:**
  - `text-faint` was listed as 50% in docs; the token was 48% at review time (user has since set it to 55%).
  - `surface-base` listed as 6% — actual is `hsl(0 0% 4%)`.
  - `surface-active-hover` (20%) exists in `index.css` and is used by components but isn't listed in the doc.
- **Fix:** reconcile the Color Tokens and Surfaces sections of `.claude/CLAUDE.md` against `app/src/index.css` `@theme`.

### Pre-existing: `ring-white/NN` focus rings (not introduced by PR #5)

- **Files:** `SliderBase.tsx:54`, `LightnessRange.tsx:87,91`, `SaturationSlider.tsx:54`, `ColorSwatch.tsx:39`, `AboutButton.tsx:655,668,705,810`
- **Severity:** Low
- **What:** Focus-ring and hover-ring utilities use `ring-white/50` / `ring-white/20`. These are UI chrome, not text, but the policy's intent (consistency) suggests tokenizing.
- **Fix:** introduce a `--color-focus-ring` token and replace call sites. Separate follow-up scope.

### Pre-existing: `ToggleSwitch` knob uses `bg-white` + `rgba()` shadows

- **File:** `app/src/components/ToggleSwitch/ToggleSwitch.tsx:42`
- **Severity:** Low
- **What:** Toggle knob uses `bg-white` and an inline `shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)]`. Pre-existing, not introduced by PR #5.
- **Fix:** tokenize once focus-ring token work lands (bundle both).

### Canvas stroke `rgba(0,0,0,0.4)` — context-appropriate

- **File:** `app/src/components/TargetSwatch/TargetSwatch.tsx:184`
- **Severity:** Accept-as-is with comment
- **What:** `ctx.strokeStyle = "rgba(0,0,0,0.4)"` on the canvas 2D context. Not a CSS text color; alpha compositing over a variable background is intentional.
- **Fix:** leave as-is; add a brief comment noting why this is not tokenized.

## Suggested sequencing

1. Quick wins (single-line): `text-white` → `text-text-primary` in FormatSelector, input `aria-label`, clear-button `focus-visible:opacity-100`, HSL/RGB spacing, `useMemo` wrap.
2. Batched token/a11y pass: `TargetFormats` opacity fix + `aria-live`, ring-white tokenization, ToggleSwitch, TargetSwatch inline boxShadow, CLAUDE.md doc reconciliation.
3. Tooling hygiene: port SSOT, dead eslint globs, `.nvmrc`, wire contrast-audit, run `lint:fix`.
4. Touch support + oklch slash-alpha: standalone enhancements, ship independently.
