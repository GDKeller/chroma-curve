import { useEffect } from "react";
import { usePaletteStore } from "../store/paletteStore";

function buildFaviconSvg(hue: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="sat" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="hsl(${hue}, 100%, 50%)"/>
    </linearGradient>
    <linearGradient id="val" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="black" stop-opacity="0"/>
      <stop offset="100%" stop-color="black"/>
    </linearGradient>
    <clipPath id="clip"><rect width="32" height="32" rx="5"/></clipPath>
    <filter id="shadow"><feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="black" flood-opacity="0.5"/></filter>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="32" height="32" fill="url(#sat)"/>
    <rect width="32" height="32" fill="url(#val)"/>
  </g>
  <rect width="32" height="32" rx="5" fill="none" stroke="hsl(0,0%,20%)" stroke-width="1.5"/>
  <path d="M24 2 Q-2 16 24 30" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" filter="url(#shadow)"/>
</svg>`;
}

export function useDynamicFavicon() {
  const hue = usePaletteStore((s) => s.hue);

  useEffect(() => {
    const svg = buildFaviconSvg(hue);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/svg+xml";
    link.href = url;

    return () => URL.revokeObjectURL(url);
  }, [hue]);
}
