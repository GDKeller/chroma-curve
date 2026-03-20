# Chroma Curve

Monochromatic palette generator using a parabolic saturation curve for perceptual balance across lightness. Originally a CodePen (oxn-krtv/ExOwLBz).

## Architecture

Vanilla HTML/JS/CSS app — no build step, no framework. Static files in `src/`.

- `src/index.html` — UI with slider controls (hue, saturation, adjustment)
- `src/script.js` — palette generation logic using chroma.js + noUiSlider
- `src/style.css` — custom slider styles and layout
- `dist/` — built/exported output

## Key Dependencies (loaded via CDN)

- **chroma.js** — color manipulation and conversion
- **noUiSlider** — range slider UI controls
- **Tailwind CSS** — utility classes for layout

## How It Works

The core formula adjusts saturation across lightness values using a parabolic curve (see `getSaturation2()`), creating neutrals that feel natural rather than flat. The Desmos visualization: https://www.desmos.com/calculator/02ufrfsuzy

## Project Board

This project uses a structured board system for project management.

- **Ask before creating new board files** — don't auto-create tasks, ADRs, etc.
- Follow the board system spec for all documentation artifacts
- Use `/board:show` to see current board state
- Use `/board:add` to create new items
- Use `/board:update` after completing significant work to reconcile the board
- Use `/board:check` when starting work to find related board context
