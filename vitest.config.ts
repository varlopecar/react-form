import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/tests/setupTests.ts"],
    },
    environment: "jsdom",
    setupFiles: "./src/tests/setupTests.ts",
    globals: true
  },
});
