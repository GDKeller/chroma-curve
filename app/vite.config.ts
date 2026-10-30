import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const GA_MEASUREMENT_ID = "G-3JZRV3QZRD";

// Injects the Google tag (gtag.js) into production builds only, so the dev server isn't tracked
function googleAnalytics(id: string): Plugin {
  return {
    name: "google-analytics",
    apply: "build",
    transformIndexHtml: () => [
      {
        tag: "script",
        attrs: {
          async: true,
          src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
        },
        injectTo: "head-prepend",
      },
      {
        tag: "script",
        children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`,
        injectTo: "head-prepend",
      },
    ],
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  return {
    plugins: [react(), tailwindcss(), googleAnalytics(GA_MEASUREMENT_ID)],
    server: { port: Number(env.PORT) || 5173 },
  };
});
