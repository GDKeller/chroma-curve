---
type: note
status: inbox
created: 2026-03-26
---

# Impeccable /critique Review

Generated via `impeccable:critique` plugin — 2026-03-26T23:15Z

## Anti-Patterns Verdict: PASS

Does not read as AI-generated. No purple gradients, glassmorphism, hero metric cards, identical card grids, gradient text, or bounce animations. Dark theme is justified (color tool — dark background lets generated colors speak). Geist is a strong font choice. The restraint is genuine, not lazy — clear point of view.

## Overall Impression

The tool feels **competent and honest** — like something built by a person who actually uses color tools. Controls are dense but legible, charts are genuinely useful (not decorative), and the generated palette is unmistakably the hero.

**Single biggest opportunity**: Vertical imbalance — left column (palette grid) ends at ~500px while right column (charts) extends to ~950px, leaving a massive void that makes the layout feel unfinished.

## What's Working

1. **The palette is the star.** Near-black background, achromatic UI, full-bleed palette strip all correctly defer to the generated colors. Nothing competes.
2. **Control bar density.** Four sliders with mode toggles, value readouts, and lock mechanism packed into one sticky row without feeling cramped. Vertical divider between color/curve groups is the right call.
3. **"What is this?" placement.** Info button sitting right after "Parabolic saturation correction" answers the question the subtitle provokes, exactly where the eye lands.

## Priority Issues

### 1. Vertical dead space in default layout
- **What**: In row layout (default), swatch grid is ~220px tall while charts column is ~700px. Below the grid is nothing.
- **Why it matters**: Looks like something broke or hasn't loaded. Asymmetry feels accidental, not designed.
- **Fix**: Let swatch grid grow taller in row mode, stack charts below the grid, or add content to left column (palette strip could move here, or palette metadata like "8 steps, hue 220, HSL").

### 2. Palette strip is an orphan
- **What**: Thin gradient bar between controls and grid toolbar floats without label, border, or context. Unclear what it represents or why it's separate from the grid below.
- **Why it matters**: New users won't understand it's a full-resolution preview of all 101 lightness steps. Reads as a decorative element or rendering artifact.
- **Fix**: Label it (subtle "FULL SCALE" or step count), integrate it as the top edge of the grid section, or remove if redundant.

### 3. "Compare" is invisible
- **What**: `Compare` disclosure in Saturation Adjustment chart uses `text-text-faint` (32% lightness) — barely distinguishable from background.
- **Why it matters**: Genuinely useful feature (unadjusted vs adjusted strips) that almost nobody will find. The comparison is one of the strongest selling points — it proves the curve works.
- **Fix**: Bump to `text-text-subtle` at minimum, add hover state, consider Phosphor `CaretRight` icon. Could default to open since strips are compact.

### 4. Export button blends in
- **What**: Export button uses `bg-surface-active` — same visual weight as format selector buttons inside the export dialog. Doesn't read as a primary action.
- **Why it matters**: Export is the terminal action of the entire tool — the reason someone came here.
- **Fix**: Subtle border (`border-border-elevated`) or slightly brighter background. Don't go full CTA (violates "instrument, not toy") but needs one notch more prominence.

### 5. Swatch labels feel fragile
- **What**: `grey-43` at `text-[11px]` and HSL value at `text-[8px]` are hard to read on mid-tone swatches, especially where contrast auto-switches between light and dark text.
- **Why it matters**: Labels are the primary output a user copies. If they can't read them, they have to hover for tooltip or click blind.
- **Fix**: Subtle text shadow or background pill behind labels on mid-tone swatches (L30-70 range). Or increase minimum font size to 9px for HSL value.

## Minor Observations

- **Hue preview dot** has `border-border-elevated` making it look slightly disconnected from the track.
- **Toggle switch on/off states** are hard to distinguish — both low-contrast grays. Thumb position communicates state, but track color difference is subtle.
- **No favicon** — 404 on every load.
- **`max-w-5xl mx-auto` on control bar** constrains it while rest of page is full-bleed. Could feel odd on ultrawide monitors.

## Questions to Consider

- **What if Compare strips were always visible?** They're compact (two 24px bars) and they're the strongest visual argument for why the curve matters. Hiding them behind a disclosure buries the lede.
- **Does the palette strip add enough value to justify its screen space?** If users always work with the grid below, the strip is redundant. If it stays, it needs to earn its position.
- **What would "confident" look like?** Right now it's self-effacing almost to a fault. The palette output deserves more ceremony — subtle outer glow or shadow to frame the grid against the background?
- **Should the default swatch count be higher?** 8 swatches in row layout creates dead space. 12 or 16 would fill the grid better and give a more impressive first impression.
