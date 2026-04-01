import { useEffect, useRef } from "react";
import { usePaletteStore } from "../store/paletteStore";

const SIZE = 32;

function buildFaviconSvg(hue: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="sat" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="hsl(${hue}, 100%, 50%)"/>
    </linearGradient>
    <linearGradient id="val" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="black" stop-opacity="0"/>
      <stop offset="100%" stop-color="black"/>
    </linearGradient>
    <clipPath id="clip"><rect width="${SIZE}" height="${SIZE}"/></clipPath>
    <filter id="shadow"><feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="black" flood-opacity="0.5"/></filter>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="${SIZE}" height="${SIZE}" fill="url(#sat)"/>
    <rect width="${SIZE}" height="${SIZE}" fill="url(#val)"/>
  </g>
  <rect width="${SIZE}" height="${SIZE}" fill="none" stroke="hsl(0,0%,20%)" stroke-width="1.5"/>
  <path d="M24 2 Q-2 16 24 30" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" filter="url(#shadow)"/>
</svg>`;
}

function renderSvgToPngHref(svg: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };

    img.src = url;
  });
}

function setFavicon(href: string) {
  // Remove all existing icon links so browsers don't prefer a static fallback
  document
    .querySelectorAll<HTMLLinkElement>('link[rel="icon"]')
    .forEach((el) => el.remove());

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = href;
  document.head.appendChild(link);
}

export function useDynamicFavicon() {
  const hue = usePaletteStore((s) => s.hue);
  const pending = useRef(0);

  useEffect(() => {
    const id = ++pending.current;
    const svg = buildFaviconSvg(hue);

    renderSvgToPngHref(svg).then((href) => {
      // Drop stale renders if hue changed while we were rasterizing
      if (id !== pending.current) return;
      setFavicon(href);
    });
  }, [hue]);
}
