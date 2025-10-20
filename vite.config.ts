import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import monacoEditorPlugin from "vite-plugin-monaco-editor-esm";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monacoEditorPlugin({
      languageWorkers: ["editorWorkerService", "json"],
      customWorkers: [
        {
          label: "graphql",
          entry: "monaco-graphql/esm/graphql.worker.js",
        },
      ],
      forceBuildCDN: true,
    }),
  ],
  optimizeDeps: {
    exclude: [
      "@codingame/monaco-vscode-json-default-extension",
      "@codingame/monaco-vscode-json-language-features-default-extension",
    ],
  },
});
