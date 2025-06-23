describe("Complete Integration Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForAppReady();
  });

  it("should complete full user registration and admin management workflow", () => {
    // Register multiple users using fixtures
    cy.registerUserFromFixture("testUser1");
    cy.registerUserFromFixture("testUser2");
    cy.registerUserFromFixture("testUser3");

    // Login as admin
    cy.loginAsAdminFromFixture();

    // Verify all users are in the admin panel
    cy.fixture("users").then((users) => {
      cy.contains("Liste des Utilisateurs").should("be.visible");

      // Check that all registered users appear in the list
      cy.contains(
        `${users.testUser1.firstName} ${users.testUser1.lastName}`
      ).should("be.visible");
      cy.contains(
        `${users.testUser2.firstName} ${users.testUser2.lastName}`
      ).should("be.visible");
      cy.contains(
        `${users.testUser3.firstName} ${users.testUser3.lastName}`
      ).should("be.visible");

      // Verify admin user is also present
      cy.contains(`${users.admin.firstName} ${users.admin.lastName}`).should(
        "be.visible"
      );
    });

    // Test user deletion
    cy.fixture("users").then((users) => {
      // Delete testUser1
      cy.contains(`${users.testUser1.firstName} ${users.testUser1.lastName}`)
        .parent()
        .parent()
        .within(() => {
          cy.contains("Supprimer").click();
        });

      // Confirm deletion
      cy.on("window:confirm", () => true);

      // Verify deletion success
      cy.contains("Utilisateur supprimé avec succès").should("be.visible");

      // Verify user is removed from list
      cy.contains(
        `${users.testUser1.firstName} ${users.testUser1.lastName}`
      ).should("not.exist");
    });

    // Test logout
    cy.contains("Déconnexion").click();
    cy.contains("Formulaire d'Inscription").should("be.visible");
  });

  it("should handle form validation errors using fixtures", () => {
    cy.fixture("users").then((users) => {
      const invalidUser = users.invalidUser;

      // Try to submit form with invalid data
      cy.get("#firstName").type(invalidUser.firstName);
      cy.get("#lastName").type(invalidUser.lastName);
      cy.get("#email").type(invalidUser.email);
      cy.get("#birthDate").type(invalidUser.birthDate);
      cy.get("#city").type(invalidUser.city);
      cy.get("#postalCode").type(invalidUser.postalCode);

      // Should show validation errors
      cy.get(".text-red-500").should("have.length.at.least", 1);

      // Submit button should be disabled
      cy.get('button[type="submit"]').should("be.disabled");
    });
  });

  it("should test admin authentication flow", () => {
    cy.fixture("users").then((users) => {
      const adminUser = users.admin;
      const invalidUser = users.invalidUser;

      // Try to login with invalid credentials
      cy.contains("Connexion Admin").click();
      cy.get("#email").type(invalidUser.email);
      cy.get("#password").type(invalidUser.password);
      cy.get("form").submit();

      // Should show error
      cy.contains("Incorrect email or password").should("be.visible");

      // Login with correct admin credentials
      cy.get("#email").clear().type(adminUser.email);
      cy.get("#password").clear().type(adminUser.password);
      cy.get("form").submit();

      // Should be redirected to admin panel
      cy.contains("Panel d'Administration").should("be.visible");
      cy.contains(`Connecté en tant que: ${adminUser.email}`).should(
        "be.visible"
      );
    });
  });

  it("should test user registration with duplicate email", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser1;

      // Register user first time
      cy.registerUserFromFixture("testUser1");

      // Try to register same user again
      cy.visit("/");
      cy.get("#firstName").type(testUser.firstName);
      cy.get("#lastName").type(testUser.lastName);
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type(testUser.birthDate);
      cy.get("#city").type(testUser.city);
      cy.get("#postalCode").type(testUser.postalCode);
      cy.get("form").submit();

      // Should show duplicate email error
      cy.contains("Email already registered").should("be.visible");
    });
  });

  it("should test responsive design and accessibility", () => {
    // Test on different viewport sizes
    cy.viewport(375, 667); // Mobile
    cy.get("form").should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");

    cy.viewport(768, 1024); // Tablet
    cy.get("form").should("be.visible");

    cy.viewport(1920, 1080); // Desktop
    cy.get("form").should("be.visible");

    // Test form accessibility
    cy.get("#firstName").should("have.attr", "id");
    cy.get('label[for="firstName"]').should("exist");
    cy.get("form").should("have.attr", "role", "form");
  });

  it("should test admin panel user management features", () => {
    // Register a user first
    cy.registerUserFromFixture("testUser1");

    // Login as admin
    cy.loginAsAdminFromFixture();

    cy.fixture("users").then((users) => {
      const testUser = users.testUser1;

      // Verify user details in table
      cy.contains(`${testUser.firstName} ${testUser.lastName}`)
        .parent()
        .parent()
        .within(() => {
          cy.contains(testUser.email).should("be.visible");
          cy.contains(testUser.city).should("be.visible");
          cy.contains(testUser.postalCode).should("be.visible");
          cy.contains("Non").should("be.visible"); // Not admin
          cy.contains("Supprimer").should("be.visible"); // Delete button present
        });

      // Test admin user row (should not have delete button)
      cy.contains(`${users.admin.firstName} ${users.admin.lastName}`)
        .parent()
        .parent()
        .within(() => {
          cy.contains("Oui").should("be.visible"); // Is admin
          cy.contains("Supprimer").should("not.exist"); // No delete button for admin
        });
    });
  });
});
