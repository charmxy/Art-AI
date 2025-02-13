import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  publicDir: "./public",
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://99.79.37.130:8000",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, "")
      },
      "/task": {
        target: "http://99.79.37.130:8000",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/task/, "")
      }
    }
  }
});
