---
type: task
status: backlog
priority: 2
created: 2026-05-06
parent: EPIC-0016
---

# TASK-0084: Disambiguate "fixed saturation" labels in About dialog

In the About dialog's opening explanation, the comparison strips are labeled **"Fixed low saturation"** and **"Fixed high saturation"** to mean *constant* saturation — i.e., the saturation value doesn't vary with lightness. But the surrounding narrative is all about *fixing* (correcting) a perceptual problem, so "fixed" reads ambiguously as "corrected" — the opposite of what's meant.

## Fix

Replace "Fixed" with an unambiguous synonym for "constant/uniform." Candidates:

- **"Static low saturation" / "Static high saturation"** — clearest match for "doesn't vary."
- **"Linear low saturation" / "Linear high saturation"** — accurate (saturation is constant across the lightness axis), and frames the comparison as linear-vs-curve, which is technically precise.
- **"Constant low saturation"** — clearest in plain English but a long word.
- **"Uniform"** — also accurate, similar trade-off.

"Linear" is probably the strongest because it implicitly contrasts with "curve" — the tool's whole identity. "Static" is the safest plain-English option.

## Acceptance

- Strip labels in `About.tsx` no longer use the word "fixed."
- Surrounding narrative copy is updated for consistency if needed.
- The opening paragraphs make clear that the comparison is **constant saturation vs. saturation that varies with lightness via the curve**.

## Related

- EPIC-0016 (parent).
- See [About.tsx](app/src/components/About.tsx) and any associated copy file.
