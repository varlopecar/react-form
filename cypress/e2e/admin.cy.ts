describe("Admin Panel", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForAppReady();
  });

  it("should login as admin successfully using fixtures", () => {
    cy.fixture("users").then((users) => {
      const adminUser = users.admin;

      // Click on admin login link
      cy.contains("Connexion Admin").click();

      // Fill in admin credentials from fixtures
      cy.get("#email").type(adminUser.email);
      cy.get("#password").type(adminUser.password);

      // Submit the form
      cy.get("form").submit();

      // Should be redirected to admin panel
      cy.contains("Panel d'Administration").should("be.visible");
      cy.contains(`Connecté en tant que: ${adminUser.email}`).should(
        "be.visible"
      );
    });
  });

  it("should display user list after admin login", () => {
    cy.fixture("users").then((users) => {
      const adminUser = users.admin;

      // Login as admin
      cy.contains("Connexion Admin").click();
      cy.get("#email").type(adminUser.email);
      cy.get("#password").type(adminUser.password);
      cy.get("form").submit();

      // Should see the user list
      cy.contains("Liste des Utilisateurs").should("be.visible");
      cy.get("table").should("be.visible");

      // Should see at least the admin user
      cy.contains(`${adminUser.firstName} ${adminUser.lastName}`).should(
        "be.visible"
      );
    });
  });

  it("should show admin user with admin badge", () => {
    cy.fixture("users").then((users) => {
      const adminUser = users.admin;

      // Login as admin
      cy.contains("Connexion Admin").click();
      cy.get("#email").type(adminUser.email);
      cy.get("#password").type(adminUser.password);
      cy.get("form").submit();

      // Find admin user row and check admin badge
      cy.contains(`${adminUser.firstName} ${adminUser.lastName}`)
        .parent()
        .parent()
        .within(() => {
          cy.contains("Oui").should("be.visible");
        });
    });
  });

  it("should allow admin to delete regular users using fixtures", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser1;

      // First register a regular user
      cy.visit("/");
      cy.get("#firstName").type(testUser.firstName);
      cy.get("#lastName").type(testUser.lastName);
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type(testUser.birthDate);
      cy.get("#city").type(testUser.city);
      cy.get("#postalCode").type(testUser.postalCode);
      cy.get("form").submit();
      cy.contains("Inscription réussie !").should("be.visible");

      // Login as admin
      cy.contains("Connexion Admin").click();
      cy.get("#email").type(users.admin.email);
      cy.get("#password").type(users.admin.password);
      cy.get("form").submit();

      // Find and delete the test user
      cy.contains(`${testUser.firstName} ${testUser.lastName}`)
        .parent()
        .parent()
        .within(() => {
          cy.contains("Supprimer").click();
        });

      // Confirm deletion
      cy.on("window:confirm", () => true);

      // Should show success message
      cy.contains("Utilisateur supprimé avec succès").should("be.visible");

      // User should be removed from the list
      cy.contains(`${testUser.firstName} ${testUser.lastName}`).should(
        "not.exist"
      );
    });
  });

  it("should not allow admin to delete themselves", () => {
    cy.fixture("users").then((users) => {
      const adminUser = users.admin;

      // Login as admin
      cy.contains("Connexion Admin").click();
      cy.get("#email").type(adminUser.email);
      cy.get("#password").type(adminUser.password);
      cy.get("form").submit();

      // Admin user should not have delete button
      cy.contains(`${adminUser.firstName} ${adminUser.lastName}`)
        .parent()
        .parent()
        .within(() => {
          cy.contains("Supprimer").should("not.exist");
        });
    });
  });

  it("should show user details in the table using fixtures", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser3;

      // Register a user with specific details
      cy.visit("/");
      cy.get("#firstName").type(testUser.firstName);
      cy.get("#lastName").type(testUser.lastName);
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type(testUser.birthDate);
      cy.get("#city").type(testUser.city);
      cy.get("#postalCode").type(testUser.postalCode);
      cy.get("form").submit();
      cy.contains("Inscription réussie !").should("be.visible");

      // Login as admin and check user details
      cy.contains("Connexion Admin").click();
      cy.get("#email").type(users.admin.email);
      cy.get("#password").type(users.admin.password);
      cy.get("form").submit();

      cy.contains(`${testUser.firstName} ${testUser.lastName}`)
        .parent()
        .parent()
        .within(() => {
          cy.contains(testUser.email).should("be.visible");
          cy.contains(testUser.city).should("be.visible");
          cy.contains(testUser.postalCode).should("be.visible");
          cy.contains("Non").should("be.visible"); // Not admin
        });
    });
  });

  it("should handle logout correctly", () => {
    cy.fixture("users").then((users) => {
      const adminUser = users.admin;

      // Login as admin
      cy.contains("Connexion Admin").click();
      cy.get("#email").type(adminUser.email);
      cy.get("#password").type(adminUser.password);
      cy.get("form").submit();

      // Click logout button
      cy.contains("Déconnexion").click();

      // Should be redirected to registration page
      cy.contains("Formulaire d'Inscription").should("be.visible");
      cy.contains("Panel d'Administration").should("not.exist");
    });
  });

  it("should prevent access to admin panel without authentication", () => {
    // Try to access admin panel directly without login
    cy.visit("/");
    cy.window().then((win) => {
      win.localStorage.removeItem("authToken");
    });

    // Should show unauthorized message
    cy.contains("Accès non autorisé").should("be.visible");
    cy.contains("Se connecter").should("be.visible");
  });

  it("should show loading state while fetching users", () => {
    cy.fixture("users").then((users) => {
      const adminUser = users.admin;

      // Login as admin
      cy.contains("Connexion Admin").click();
      cy.get("#email").type(adminUser.email);
      cy.get("#password").type(adminUser.password);
      cy.get("form").submit();

      // Should show loading message initially
      cy.contains("Chargement des utilisateurs").should("be.visible");

      // Then should show the user list
      cy.contains("Liste des Utilisateurs").should("be.visible");
    });
  });

  it("should handle multiple user registrations and display them in admin panel using fixtures", () => {
    cy.fixture("users").then((users) => {
      const usersToRegister = [users.testUser1, users.testUser2];

      // Register multiple users
      usersToRegister.forEach((userData) => {
        cy.visit("/");
        cy.get("#firstName").type(userData.firstName);
        cy.get("#lastName").type(userData.lastName);
        cy.get("#email").type(userData.email);
        cy.get("#birthDate").type(userData.birthDate);
        cy.get("#city").type(userData.city);
        cy.get("#postalCode").type(userData.postalCode);
        cy.get("form").submit();
        cy.contains("Inscription réussie !").should("be.visible");
      });

      // Login as admin
      cy.contains("Connexion Admin").click();
      cy.get("#email").type(users.admin.email);
      cy.get("#password").type(users.admin.password);
      cy.get("form").submit();

      // Should see all users including admin
      cy.contains("Liste des Utilisateurs").should("be.visible");

      usersToRegister.forEach((userData) => {
        cy.contains(`${userData.firstName} ${userData.lastName}`).should(
          "be.visible"
        );
      });
    });
  });

  it("should test admin login with invalid credentials using fixtures", () => {
    cy.fixture("users").then((users) => {
      const invalidUser = users.invalidUser;

      // Try to login with invalid credentials
      cy.contains("Connexion Admin").click();
      cy.get("#email").type(invalidUser.email);
      cy.get("#password").type(invalidUser.password);
      cy.get("form").submit();

      // Should show error message
      cy.contains("Incorrect email or password").should("be.visible");
    });
  });
});
