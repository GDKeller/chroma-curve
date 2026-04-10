---
type: task
status: backlog
priority: 1
created: 2026-04-09
parent: EPIC-0013
blocked_by: TASK-0063
---

# TASK-0064: Create `/` page with React island and sr-only SEO content

Create `src/pages/index.astro` — the root route hosting the palette generator as a `client:load` React island, wrapped in SSR'd semantic content for crawlers.

## Page structure

```astro
---
import Layout from "../layouts/Layout.astro";
import PaletteGenerator from "../components/palette-generator/PaletteGenerator";
---

<Layout
  title="Chroma Curve | Monochromatic Palette Generator"
  description="Generate perceptually balanced monochromatic palettes using a parabolic saturation curve. Fine-tune hue, saturation, and lightness for natural color scales."
>
  <main>
    <h1 class="sr-only">Chroma Curve — monochromatic palettes with a parabolic saturation curve</h1>
    <p class="sr-only">
      Chroma Curve is a free tool for generating perceptually balanced monochromatic color palettes.
      It uses a parabolic saturation curve to prevent muddy midtones and blown-out extremes, producing
      scales that feel cohesive across the full lightness range — ideal for design systems, refined
      neutral palettes with subtle hue tinting, and monochromatic brand schemes.
    </p>
    <PaletteGenerator client:load />
  </main>
</Layout>
```

## Hydration strategy

`client:load` — hydrates as soon as the page loads. Alternatives considered:

- `client:only="react"`: ships only a skeleton to crawlers. **Rejected** — defeats the crawler-visibility goal.
- `client:idle`: hydrates after `requestIdleCallback`. Reasonable but adds a visible delay before interactivity for a tool-first experience.
- `client:visible`: waits for scroll-into-view. Not applicable — the tool is above the fold.

## sr-only utility

Tailwind 4 ships `.sr-only` by default. Verify during implementation; if absent, add to `global.css`:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Verification

- [ ] View-source on `/` shows the full h1 text and descriptive paragraph in the rendered HTML
- [ ] Both are visually hidden in the browser
- [ ] The palette generator hydrates and becomes interactive
- [ ] No layout shift during hydration
- [ ] Screen reader announces the h1 and description correctly
