import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://wakili.runasp.net",
        changeOrigin: true,
        secure: false, // only if the backend is HTTP, not HTTPS
        rewrite: (path) => path, // no rewrite needed if paths match
      },
    },
  },
});
