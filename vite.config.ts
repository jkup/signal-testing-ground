import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          "monaco-editor": ["monaco-editor"],
          "signal-frameworks": [
            "@preact/signals-core",
            "@vue/reactivity",
            "solid-js",
            "alien-signals",
            "signalium",
            "signia",
            "@angular/core",
            "signal-polyfill",
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "monaco-editor",
      "@preact/signals-core",
      "@vue/reactivity",
      "solid-js",
      "alien-signals",
      "signalium",
      "signia",
      "@angular/core",
      "signal-polyfill",
    ],
  },
});
