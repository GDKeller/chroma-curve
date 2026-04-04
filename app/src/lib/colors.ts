import chroma from "chroma-js";

const WCAG_AA_CONTRAST = 4.5;

export function getContrastColor(bgColor: string): string {
  const whiteContrast = chroma.contrast("white", bgColor);
  return whiteContrast < WCAG_AA_CONTRAST ? "#1d1d1d" : "#ffffff";
}

export function toOklchString(hex: string): string {
  const [l, c, h] = chroma(hex).oklch();
  const lR = Math.round(l * 1000) / 1000;
  const cR = Math.round((c || 0) * 1000) / 1000;
  const hR = Math.round(h || 0);
  return `oklch(${lR} ${cR} ${hR})`;
}
