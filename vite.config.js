import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
// https://vite.dev/config/
export default defineConfig({
    base: "/vitest-vite-app/",
    plugins: [react(), tailwindcss()],
    build: {
        outDir: "dist",
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "@varlopecar/ci-cd",
            fileName: function (format) { return "index.".concat(format, ".js"); },
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
    },
});
