export const W = 400;
export const H = 400;
export const PAD = { top: 24, right: 24, bottom: 36, left: 48 };
export const PLOT_W = W - PAD.left - PAD.right;
export const PLOT_H = H - PAD.top - PAD.bottom;

export function toSvgX(lightness: number): number {
  return PAD.left + (lightness / 100) * PLOT_W;
}

export function toSvgY(value: number, yMin: number, yMax: number): number {
  return PAD.top + (1 - (value - yMin) / (yMax - yMin)) * PLOT_H;
}
