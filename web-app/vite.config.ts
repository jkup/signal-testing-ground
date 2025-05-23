import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2020",
  },
  optimizeDeps: {
    include: ["monaco-editor"],
    exclude: ["monaco-editor/esm/vs/editor/editor.worker"],
  },
  define: {
    global: "globalThis",
  },
  server: {
    fs: {
      strict: false,
    },
  },
  worker: {
    format: "es",
  },
});
