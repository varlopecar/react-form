import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 8000, // Augmenté pour permettre le chargement
    requestTimeout: 8000,
    responseTimeout: 8000,
    pageLoadTimeout: 30000, // Augmenté pour React
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: {
      runMode: 0,
      openMode: 0,
    },
    // Exclure les tests lents
    excludeSpecPattern: [
      "**/blog-api.cy.ts", // Tests d'API externe
      "**/frontend-backend-integration.cy.ts" // Tests d'intégration complexes
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
}); 