import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7118",
        changeOrigin: true,
        secure: false, // allow self-signed HTTPS
        // rewrite: (path) => path, // keep /api prefix
      },
    },
  },
});
