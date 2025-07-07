import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if we're building the library for NPM
const isLib = process.env.BUILD_MODE === "lib";
// Check if we're in Docker environment
const isDocker = process.env.DOCKER_ENV === "true";
// Check if we're in development
const isDev = process.env.NODE_ENV === "development";
// Check if we're building for web app
const isWebBuild = process.env.BUILD_MODE === "web";

// Custom plugin for HTML template replacement
const htmlTemplatePlugin = () => {
  return {
    name: "html-template-replace",
    transformIndexHtml: {
      order: "pre" as const,
      handler(html: string) {
        const apiUrl = process.env.VITE_API_URL || "http://localhost:8000";

        console.log("🔧 Replacing VITE_API_URL in HTML template:", apiUrl);
        return html.replace(/%VITE_API_URL%/g, apiUrl);
      },
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  // Only use the base path for GitHub Pages deployment
  base: isLib || isDocker || isDev ? "/" : isWebBuild ? "/react-form/" : "/",
  plugins: [
    react(),
    !isLib && tailwindcss(),
    !isLib && htmlTemplatePlugin(),
  ].filter(Boolean),
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
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
