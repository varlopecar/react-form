import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if we're building the library for NPM
const isLib = process.env.BUILD_MODE === "lib";
// Check if we're in CI environment
const isCI = process.env.CI === "true";

// https://vite.dev/config/
export default defineConfig({
  // Only use the base path for the web app in production, not for the library or CI
  base: isLib || isCI ? "/" : "/react-form/",
  plugins: [react(), !isLib && tailwindcss()].filter(Boolean),
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    ...(isLib
      ? {
          // Library build configuration
          lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "@varlopecar/ci-cd",
            fileName: (format) => `index.${format}.js`,
          },
        }
      : {
          // Web app build configuration
          rollupOptions: {
            input: {
              main: resolve(__dirname, "index.html"),
            },
          },
        }),
    // Common options for both builds
    rollupOptions: {
      external: isLib ? ["react", "react-dom"] : [],
      output: {
        ...(isLib
          ? {
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
              },
            }
          : {}),
      },
    },
  },
});
