#!/usr/bin/env node

/**
 * Parses text and surface color tokens from index.css and prints
 * a contrast-ratio matrix, flagging AA (≥4.5:1) and AAA (≥7:1).
 *
 * Usage: node scripts/contrast-audit.mjs
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(
  resolve(__dirname, "../app/src/index.css"),
  "utf-8",
);

// Extract HSL lightness from achromatic tokens: hsl(0 0% L%)
const tokenRe = /--color-(text|surface)-([\w-]+):\s*hsl\(\s*0\s+0%\s+([\d.]+)%\s*\)/g;

const text = [];
const surfaces = [];

for (const m of css.matchAll(tokenRe)) {
  const [, group, name, lightness] = m;
  const entry = { name, pct: parseFloat(lightness) };
  if (group === "text") text.push(entry);
  else surfaces.push(entry);
}

if (!text.length || !surfaces.length) {
  console.error("No tokens found — check index.css format");
  process.exit(1);
}

// sRGB linearization
const linearize = (c) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const luminance = (pct) => linearize(pct / 100);
const contrast = (l1, l2) => {
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
};

// ANSI colors
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;

// Layout
const COL = 14;
const LABEL = 26;
const pad = (s) => s.padStart(COL);
const label = (s) => s.padEnd(LABEL);

// Header
console.log(label("") + text.map((t) => pad(t.name)).join(""));
console.log(label("") + text.map((t) => pad(`L:${t.pct}%`)).join(""));
console.log("-".repeat(LABEL + text.length * COL));

// Rows
let failures = 0;

for (const bg of surfaces) {
  const bLum = luminance(bg.pct);
  let row = label(`${bg.name} (L:${bg.pct}%)`);
  for (const fg of text) {
    const r = contrast(luminance(fg.pct), bLum);
    let tag = "";
    const val = `${r.toFixed(1)}:1`;
    let level, colorize;
    if (r >= 7) {
      level = "AAA ";
      colorize = green;
    } else if (r >= 4.5) {
      level = "AA  ";
      colorize = yellow;
    } else {
      level = "FAIL";
      colorize = red;
      failures++;
    }
    row += colorize(pad(`${val} ${level}`));
  }
  console.log(row);
}

console.log("-".repeat(LABEL + text.length * COL));
console.log(
  `\n${failures === 0 ? "All combinations meet AA." : `${failures} combination(s) below AA (4.5:1).`}`,
);

process.exit(failures > 0 ? 1 : 0);
