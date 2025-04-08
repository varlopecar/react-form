import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        // Dependencies and build output
        "node_modules/",
        "dist/",

        // Configuration files
        "vite.config.ts",
        "vite.config.js",
        "vite.config.d.ts",
        "vitest.config.ts",
        "eslint.config.js",

        // Type declaration files
        "src/vite-env.d.ts",
        "**/*.d.ts",

        // Documentation and utility scripts
        "public/docs/**/*",

        // Test setup files
        "src/tests/setupTests.ts",
        "src/tests/**/*.ts",

        // Entry points that don't need testing
        "src/main.tsx",
        "src/index.tsx",

        // Models (TypeScript interfaces)
        "src/models/**/*",
      ],
    },
    environment: "jsdom",
    setupFiles: "./src/tests/setupTests.ts",
    globals: true,
  },
});
