import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    video: false,
    screenshotOnRunFailure: false, // Désactiver les screenshots pour aller plus vite
    defaultCommandTimeout: 5000, // Réduire de 10s à 5s
    requestTimeout: 5000, // Réduire de 10s à 5s
    responseTimeout: 5000, // Réduire de 10s à 5s
    pageLoadTimeout: 30000, // Réduire de 60s à 30s
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: {
      runMode: 0, // Désactiver les retries pour aller plus vite
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
