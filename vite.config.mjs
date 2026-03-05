import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/unife": {
        target: "https://tracciabilita.unife.it:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/unife/, ""),
      },
    },
  },
});
