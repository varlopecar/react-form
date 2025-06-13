var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
// Check if we're building the library for NPM
var isLib = process.env.BUILD_MODE === "lib";
// https://vite.dev/config/
export default defineConfig({
    // Only use the base path for the web app, not for the library
    base: isLib ? "/" : "/react-form/",
    plugins: [react(), !isLib && tailwindcss()].filter(Boolean),
    build: __assign(__assign({ outDir: "dist", emptyOutDir: true, sourcemap: true }, (isLib
        ? {
            // Library build configuration
            lib: {
                entry: resolve(__dirname, "src/index.ts"),
                name: "@varlopecar/ci-cd",
                fileName: function (format) { return "index.".concat(format, ".js"); },
            },
        }
        : {
            // Web app build configuration
            rollupOptions: {
                input: {
                    main: resolve(__dirname, "index.html"),
                },
            },
        })), { 
        // Common options for both builds
        rollupOptions: {
            external: isLib ? ["react", "react-dom"] : [],
            output: __assign({}, (isLib
                ? {
                    globals: {
                        react: "React",
                        "react-dom": "ReactDOM",
                    },
                }
                : {})),
        } }),
});
