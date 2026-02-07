import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: "ConstructionX",
        short_name: "ConstructionX",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          { src: "/logo.png.192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/logo.png.512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/logo.png.512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://fradotovic-001-site1.jtempurl.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    proxy: {
      "/api": {
        target: "https://localhost:7118",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
