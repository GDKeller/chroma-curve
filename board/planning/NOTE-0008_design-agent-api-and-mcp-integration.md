---
type: note
status: inbox
created: 2026-03-20
---

# Design Agent API & MCP Integration

Make Chroma Curve's palette engine accessible to AI design agents and design tools, so they can generate perceptually balanced palettes without leaving their workflow.

## Vision

Meet designers where they are — inside Figma, in agent-driven workflows, or via API. The parabolic saturation curve is the differentiator; expose it as a service.

## Proposed Surface Areas

### 1. `llms.txt`
Add a structured `llms.txt` at the site root describing the tool's capabilities, API endpoints, and usage patterns so LLM-based agents can discover and use Chroma Curve autonomously.

### 2. Public API
Expose palette generation as a lightweight HTTP API:
- `GET /api/palette?hue=220&saturation=80&steps=11&format=oklch`
- Return structured JSON with color entries, curve parameters, and metadata
- Support multiple output formats (hex, HSL, OKLCH, CSS custom properties)

### 3. MCP Server
Package the palette engine as an MCP server tool so Claude and other MCP-compatible agents can call it directly during design conversations.

## Design Tool Ecosystem Research

Questions to investigate:

- **Figma**: Has a rich plugin ecosystem (JS-based). Plugins can make HTTP requests to external APIs. No native MCP support, but a plugin could wrap API calls. Figma also has a REST API for reading/writing files programmatically.
- **Sketch**: Plugin ecosystem exists but smaller. HTTP calls possible from plugins.
- **Adobe XD / Illustrator**: UXP plugin platform supports fetch. Creative Cloud has extensibility points.
- **Penpot**: Open-source, plugin system in development. API-first architecture.
- **Design agent tools** (e.g., Galileo AI, Uizard, Relume): These are LLM-driven — `llms.txt` and API would be the natural integration path.

### Key Questions
- Which design tools have the largest plugin install bases?
- Is a Figma plugin the highest-leverage first move?
- Should the API be standalone or bundled with the existing Vite app?
- What's the minimal viable API surface to be useful to an agent?

## Potential Figma Plugin Flow
1. Designer selects a base hue (or picks from canvas)
2. Plugin calls Chroma Curve API with hue + preferences
3. Returns palette as Figma color styles or variables
4. Designer applies directly to their design system

## Priority Thinking
- **llms.txt** — lowest effort, immediate discoverability for AI agents
- **API** — medium effort, unlocks all programmatic integrations
- **MCP server** — medium effort, best experience for Claude-based design workflows
- **Figma plugin** — higher effort, highest designer reach
