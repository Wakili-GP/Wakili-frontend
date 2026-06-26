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
        // rewrite: (path) => path, // no rewrite needed if paths match
      },
      "/hubs": {
        target: "http://wakili.runasp.net",
        changeOrigin: true,
        secure: false,
        ws: true, // proxy websockets
        rewrite: (path) => path,
      },
      "/chatbot-api": {
        target: "https://mayarwaleedd12--wakili-api-fastapi-app.modal.run",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chatbot-api/, ""),
      },
      "/review-api": {
        target: "https://nouraelkashif83--legal-ai-auditor-api.modal.run",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/review-api/, ""),
      },
    },
  },
});
