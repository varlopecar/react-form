/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to register a new user using fixtures
       * @example cy.registerUserFromFixture('testUser1')
       */
      registerUserFromFixture(fixtureName: string): Chainable<void>;

      /**
       * Custom command to login as admin using fixtures
       * @example cy.loginAsAdminFromFixture()
       */
      loginAsAdminFromFixture(): Chainable<void>;

      /**
       * Custom command to wait for the application to be ready
       * @example cy.waitForAppReady()
       */
      waitForAppReady(): Chainable<void>;

      /**
       * Custom command to clear database state
       * @example cy.clearDatabase()
       */
      clearDatabase(): Chainable<void>;

      /**
       * Custom command to register a user
       * @example cy.registerUser(userData)
       */
      registerUser(userData: any): Chainable<void>;
    }
  }
}

Cypress.Commands.add("registerUserFromFixture", (fixtureName: string) => {
  cy.fixture("users").then((users) => {
    const userData = users[fixtureName];

    cy.visit("/");

    // Fill in the registration form
    cy.get("#firstName").type(userData.firstName);
    cy.get("#lastName").type(userData.lastName);
    cy.get("#email").type(userData.email);
    cy.get("#birthDate").type(userData.birthDate);
    cy.get("#city").type(userData.city);
    cy.get("#postalCode").type(userData.postalCode);

    // Submit the form
    cy.get("form").submit();

    // Wait for success message
    cy.contains("Inscription réussie !").should("be.visible");
  });
});

Cypress.Commands.add("loginAsAdminFromFixture", () => {
  cy.fixture("users").then((users) => {
    const adminUser = users.admin;

    cy.visit("/");

    // Click on admin login link
    cy.contains("Connexion Admin").click();

    // Fill in admin credentials from fixtures
    cy.get("#email").type(adminUser.email);
    cy.get("#password").type(adminUser.password);

    // Submit the form
    cy.get("form").submit();

    // Wait for redirect to admin panel
    cy.url().should("include", "/");
    cy.contains("Panel d'Administration").should("be.visible");
  });
});

Cypress.Commands.add("waitForAppReady", () => {
  // Wait for the main content to be loaded
  cy.get("body").should("be.visible");

  // Wait a bit more for any async operations
  cy.wait(1000);
});

Cypress.Commands.add("clearDatabase", () => {
  // This command can be used to reset the database state between tests
  // For now, we'll just wait a bit to ensure clean state
  cy.wait(500);
});

Cypress.Commands.add("registerUser", (userData: any) => {
  cy.visit("/");

  // Fill in the registration form
  cy.get("#firstName").type(userData.firstName);
  cy.get("#lastName").type(userData.lastName);
  cy.get("#email").type(userData.email);
  cy.get("#birthDate").type(userData.birthDate);
  cy.get("#city").type(userData.city);
  cy.get("#postalCode").type(userData.postalCode);

  // Submit the form
  cy.get("form").submit();

  // Wait for success message
  cy.contains("Inscription réussie !").should("be.visible");
});
