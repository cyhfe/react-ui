// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "lib/index.ts"),
      // the proper extensions will be added
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
  plugins: [react(), dts({ rollupTypes: true })],
});
