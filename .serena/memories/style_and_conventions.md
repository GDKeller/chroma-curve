# Code Style & Conventions

## TypeScript
- Strict TypeScript with `"strict": true`
- `.tsx` for components, `.ts` for logic/utilities
- camelCase for variables, functions, methods
- PascalCase for components and types/interfaces

## Formatting (Prettier)
- Semicolons: yes
- Quotes: double quotes (`"`)
- Trailing commas: all
- Print width: 90 characters
- Tab width: 2 spaces
- No tabs (spaces only)

## React Patterns
- Functional components only
- Zustand for global state (single store: `paletteStore`)
- Custom hooks in `hooks/` directory
- Radix UI primitives for accessible UI components
- Framer Motion for animations

## Styling
- Tailwind CSS 4 with `@theme` for custom tokens
- Geist Sans/Mono as primary fonts
- CSS custom properties via Tailwind's `@theme` directive
- `prefers-reduced-motion` media query respected
- Pure grayscale UI chrome aesthetic

## File Organization
- Components grouped by feature area: `controls/`, `palette/`, `curves/`, `export/`
- Shared types in `types/` directory
- Business logic in `lib/` directory
- State in `store/` directory

## ESLint
- Uses flat config (eslint.config.js)
- Extends: recommended JS, typescript-eslint, react-hooks, react-refresh
