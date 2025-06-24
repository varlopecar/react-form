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
// Check if we're in Docker environment
var isDocker = process.env.DOCKER_ENV === "true";
// Check if we're in development
var isDev = process.env.NODE_ENV === "development";
// Check if we're building for web app
var isWebBuild = process.env.BUILD_MODE === "web";
// Custom plugin for HTML template replacement
var htmlTemplatePlugin = function () {
    return {
        name: "html-template-replace",
        transformIndexHtml: {
            order: "pre",
            handler: function (html) {
                var isDevelopment = process.env.NODE_ENV === "development" ||
                    process.env.NODE_ENV === undefined;
                var defaultApiUrl = isDevelopment
                    ? "http://localhost:8000"
                    : "https://backend-omega-khaki.vercel.app/";
                var apiUrl = process.env.VITE_API_URL || defaultApiUrl;
                console.log("🔧 Replacing VITE_API_URL in HTML template:", apiUrl, "(".concat(isDevelopment ? "development" : "production", ")"));
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
