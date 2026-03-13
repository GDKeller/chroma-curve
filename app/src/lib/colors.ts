import chroma from "chroma-js";

export function getContrastColor(bgColor: string): string {
  const whiteContrast = chroma.contrast("white", bgColor);
  return whiteContrast < 2.9 ? "#1d1d1d" : "#ffffff";
}
