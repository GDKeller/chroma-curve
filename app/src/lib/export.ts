import chroma from "chroma-js";
import type { ColorEntry, ExportFormat, ColorSpace } from "../types/palette";

function colorValue(entry: ColorEntry, space: ColorSpace): string {
  const c = chroma(entry.hex);
  switch (space) {
    case "hsl":
      return `hsl(${entry.hslString})`;
    case "hex":
      return entry.hex;
    case "rgb": {
      const [r, g, b] = c.rgb();
      return `rgb(${r}, ${g}, ${b})`;
    }
    case "hcl": {
      const [h, c2, l] = c.hcl();
      const hR = Math.round(h || 0);
      const cR = Math.round((c2 || 0) * 10) / 10;
      const lR = Math.round(l * 10) / 10;
      return `hcl(${hR}, ${cR}, ${lR})`;
    }
    case "oklch": {
      const [l, c2, h] = c.oklch();
      const lR = Math.round(l * 1000) / 1000;
      const cR = Math.round((c2 || 0) * 1000) / 1000;
      const hR = Math.round(h || 0);
      return `oklch(${lR} ${cR} ${hR})`;
    }
  }
}

export function formatPalette(
  entries: ColorEntry[],
  format: ExportFormat,
  space: ColorSpace,
): string {
  switch (format) {
    case "css":
      return formatCSS(entries, space);
    case "tw4":
      return formatTailwindV4(entries, space);
    case "tw3":
      return formatTailwindV3(entries, space);
    case "scss":
      return formatSCSS(entries, space);
    case "js":
      return formatJS(entries, space);
    case "json":
      return formatJSON(entries, space);
    case "gpl":
      return formatGPL(entries);
    case "text":
      return formatText(entries, space);
  }
}

function formatCSS(entries: ColorEntry[], space: ColorSpace): string {
  const vars = entries
    .map((e) => `  --${e.label}: ${colorValue(e, space)};`)
    .join("\n");
  return `:root {\n${vars}\n}`;
}

function formatTailwindV4(entries: ColorEntry[], space: ColorSpace): string {
  const vars = entries
    .map((e) => `  --color-${e.label}: ${colorValue(e, space)};`)
    .join("\n");
  return `@theme {\n${vars}\n}`;
}

function formatTailwindV3(entries: ColorEntry[], space: ColorSpace): string {
  const colors: Record<string, string> = {};
  for (const e of entries) {
    const num = e.label.replace("grey-", "");
    colors[num] = colorValue(e, space);
  }
  const inner = JSON.stringify({ grey: colors }, null, 4)
    .split("\n")
    .map((line) => `      ${line}`)
    .join("\n")
    .trim();
  return `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${inner},\n    },\n  },\n};`;
}

function formatSCSS(entries: ColorEntry[], space: ColorSpace): string {
  return entries
    .map((e) => `$${e.label}: ${colorValue(e, space)};`)
    .join("\n");
}

function formatJS(entries: ColorEntry[], space: ColorSpace): string {
  const colors: Record<string, string> = {};
  for (const e of entries) {
    const num = e.label.replace("grey-", "");
    colors[num] = colorValue(e, space);
  }
  return `export const grey = ${JSON.stringify(colors, null, 2)} as const;`;
}

function formatJSON(entries: ColorEntry[], space: ColorSpace): string {
  const tokens: Record<string, { $value: string; $type: string }> = {};
  for (const e of entries) {
    const num = e.label.replace("grey-", "");
    tokens[num] = {
      $value: colorValue(e, space),
      $type: "color",
    };
  }
  return JSON.stringify({ grey: tokens }, null, 2);
}

function formatGPL(entries: ColorEntry[]): string {
  const lines = ["GIMP Palette", "Name: Grey Neutrals", `Columns: ${entries.length}`, "#"];
  for (const e of entries) {
    const c = chroma(e.hex);
    const [r, g, b] = c.rgb();
    lines.push(`${String(Math.round(r)).padStart(3)} ${String(Math.round(g)).padStart(3)} ${String(Math.round(b)).padStart(3)}\t${e.label}`);
  }
  return lines.join("\n");
}

function formatText(entries: ColorEntry[], space: ColorSpace): string {
  const maxLabel = Math.max(...entries.map((e) => e.label.length));
  return entries
    .map((e) => `${e.label.padEnd(maxLabel)}  ${colorValue(e, space)}`)
    .join("\n");
}

const FORMAT_EXTENSIONS: Record<ExportFormat, string> = {
  css: "css",
  tw4: "css",
  tw3: "js",
  scss: "scss",
  js: "ts",
  json: "json",
  gpl: "gpl",
  text: "txt",
};

export function downloadPalette(
  entries: ColorEntry[],
  format: ExportFormat,
  space: ColorSpace,
): void {
  const content = formatPalette(entries, format, space);
  const ext = FORMAT_EXTENSIONS[format];
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `palette.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}
