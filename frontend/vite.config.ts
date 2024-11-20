import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://backend:3000",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
      "/profile_pictures": {
        target: "http://backend:3000",
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true, // Required for Docker
    },
  },
});
