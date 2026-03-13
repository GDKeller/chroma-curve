import type { ColorEntry, ExportFormat } from "../types/palette";

export function formatPalette(entries: ColorEntry[], format: ExportFormat): string {
  switch (format) {
    case "css":
      return formatCSS(entries);
    case "tailwind":
      return formatTailwind(entries);
    case "json":
      return formatJSON(entries);
  }
}

function formatCSS(entries: ColorEntry[]): string {
  const vars = entries
    .map((e) => `  --${e.label}: hsl(${e.hslString});`)
    .join("\n");
  return `:root {\n${vars}\n}`;
}

function formatTailwind(entries: ColorEntry[]): string {
  const vars = entries
    .map((e) => `  --color-${e.label}: hsl(${e.hslString});`)
    .join("\n");
  return `@theme {\n${vars}\n}`;
}

function formatJSON(entries: ColorEntry[]): string {
  const tokens: Record<string, { $value: string; $type: string }> = {};
  for (const e of entries) {
    const num = e.label.replace("grey-", "");
    tokens[num] = {
      $value: `hsl(${e.hslString})`,
      $type: "color",
    };
  }
  return JSON.stringify({ grey: tokens }, null, 2);
}
