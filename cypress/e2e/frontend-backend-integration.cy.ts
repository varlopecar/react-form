describe("Frontend-Backend Integration Tests", () => {
  beforeEach(() => {
    // Visit the application
    cy.visit("/");
  });

  describe("User Registration", () => {
    it("should register a new user successfully", () => {
      // Fill out the registration form
      cy.get("#firstName").type("John");
      cy.get("#lastName").type("Doe");
      cy.get("#email").type("john.doe@example.com");
      cy.get("#birthDate").type("1990-01-01");
      cy.get("#city").type("Paris");
      cy.get("#postalCode").type("75001");

      // Submit the form
      cy.get("form").submit();

      // Check for success message
      cy.contains("Inscription réussie !").should("be.visible");
    });

    it("should show validation errors for invalid data", () => {
      // Try to submit empty form
      cy.get("form").submit();

      // Check for validation errors
      cy.contains("Le prénom est requis").should("be.visible");
      cy.contains("Le nom est requis").should("be.visible");
      cy.contains("L'email n'est pas valide").should("be.visible");
    });

    it("should prevent duplicate email registration", () => {
      // Register first user
      cy.get("#firstName").type("Jane");
      cy.get("#lastName").type("Smith");
      cy.get("#email").type("jane.smith@example.com");
      cy.get("#birthDate").type("1995-05-15");
      cy.get("#city").type("Lyon");
      cy.get("#postalCode").type("69001");
      cy.get("form").submit();
      cy.contains("Inscription réussie !").should("be.visible");

      // Try to register with same email
      cy.get("#firstName").clear().type("Jane2");
      cy.get("#lastName").clear().type("Smith2");
      cy.get("#email").clear().type("jane.smith@example.com"); // Same email
      cy.get("#birthDate").clear().type("1995-05-15");
      cy.get("#city").clear().type("Marseille");
      cy.get("#postalCode").clear().type("13001");
      cy.get("form").submit();

      // Should show error for duplicate email
      cy.contains("Email already registered").should("be.visible");
    });
  });

  describe("User Login", () => {
    beforeEach(() => {
      // Navigate to login page
      cy.contains("Connexion Admin").click();
    });

    it("should login with valid admin credentials", () => {
      // Login with admin credentials
      cy.get("#email").type("admin@example.com");
      cy.get("#password").type("admin123");
      cy.get("form").submit();

      // Should redirect to admin panel
      cy.contains("Panel d'Administration").should("be.visible");
      cy.contains("Connecté en tant que: admin@example.com").should(
        "be.visible"
      );
    });

    it("should login with valid user credentials", () => {
      // First register a user
      cy.contains("Retour à l'inscription").click();
      cy.get("#firstName").type("Test");
      cy.get("#lastName").type("User");
      cy.get("#email").type("test.user@example.com");
      cy.get("#birthDate").type("1990-01-01");
      cy.get("#city").type("Paris");
      cy.get("#postalCode").type("75001");
      cy.get("form").submit();
      cy.contains("Inscription réussie !").should("be.visible");

      // Now login with the registered user
      cy.contains("Connexion Admin").click();
      cy.get("#email").type("test.user@example.com");
      cy.get("#password").type("password123"); // Default password from registration
      cy.get("form").submit();

      // Should redirect to admin panel (users can access admin panel)
      cy.contains("Panel d'Administration").should("be.visible");
      cy.contains("Connecté en tant que: test.user@example.com").should(
        "be.visible"
      );
    });

    it("should show error for invalid credentials", () => {
      cy.get("#email").type("invalid@example.com");
      cy.get("#password").type("wrongpassword");
      cy.get("form").submit();

      // Should show error message
      cy.contains("Invalid credentials").should("be.visible");
    });
  });

  describe("Admin Panel and User Management", () => {
    beforeEach(() => {
      // Login as admin
      cy.contains("Connexion Admin").click();
      cy.get("#email").type("admin@example.com");
      cy.get("#password").type("admin123");
      cy.get("form").submit();
      cy.contains("Panel d'Administration").should("be.visible");
    });

    it("should display users table with registered users", () => {
      // Check that the users table is displayed
      cy.contains("Liste des Utilisateurs").should("be.visible");
      cy.get("table").should("be.visible");

      // Check table headers
      cy.contains("th", "Nom").should("be.visible");
      cy.contains("th", "Email").should("be.visible");
      cy.contains("th", "Ville").should("be.visible");
      cy.contains("th", "Code Postal").should("be.visible");
      cy.contains("th", "Date de naissance").should("be.visible");
      cy.contains("th", "Admin").should("be.visible");
      cy.contains("th", "Actions").should("be.visible");

      // Should show at least the admin user
      cy.contains("td", "admin@example.com").should("be.visible");
      cy.contains("td", "Oui").should("be.visible"); // Admin status
    });

    it("should allow admin to delete non-admin users", () => {
      // First register a test user
      cy.contains("Déconnexion").click();
      cy.contains("Retour à l'inscription").click();
      cy.get("#firstName").type("Delete");
      cy.get("#lastName").type("User");
      cy.get("#email").type("delete.user@example.com");
      cy.get("#birthDate").type("1990-01-01");
      cy.get("#city").type("Paris");
      cy.get("#postalCode").type("75001");
      cy.get("form").submit();
      cy.contains("Inscription réussie !").should("be.visible");

      // Login as admin again
      cy.contains("Connexion Admin").click();
      cy.get("#email").type("admin@example.com");
      cy.get("#password").type("admin123");
      cy.get("form").submit();

      // Check that the new user appears in the table
      cy.contains("td", "delete.user@example.com").should("be.visible");
      cy.contains("td", "Non").should("be.visible"); // Non-admin status

      // Delete the user
      cy.contains("td", "delete.user@example.com")
        .parent("tr")
        .within(() => {
          cy.contains("button", "Supprimer").click();
        });

      // Confirm deletion
      cy.on("window:confirm", () => true);

      // Check success message
      cy.contains("Utilisateur supprimé avec succès").should("be.visible");

      // User should be removed from table
      cy.contains("td", "delete.user@example.com").should("not.exist");
    });

    it("should not allow deletion of admin users", () => {
      // Admin users should not have delete buttons
      cy.contains("td", "admin@example.com")
        .parent("tr")
        .within(() => {
          cy.contains("button", "Supprimer").should("not.exist");
        });
    });

    it("should show user count in table header", () => {
      // The table header should show the number of users
      cy.contains("Liste des Utilisateurs").should("be.visible");
      // This will match something like "Liste des Utilisateurs (2)"
      cy.get("h2").should("contain", "Liste des Utilisateurs (");
    });

    it("should display user information correctly", () => {
      // Check that user data is displayed properly
      cy.contains("td", "admin@example.com").should("be.visible");
      cy.contains("td", "Oui").should("be.visible"); // Admin status

      // Check date formatting
      cy.get("table tbody tr")
        .first()
        .within(() => {
          cy.get("td").eq(4).should("contain", "/"); // Date should be formatted
        });
    });
  });

  describe("Blog Posts Integration", () => {
    it("should display blog posts on the main page", () => {
      // Check that blog posts are displayed
      cy.contains("Articles de Blog").should("be.visible");
      
      // Should show posts section
      cy.get('[data-testid="posts-section"]').should("be.visible");
    });

    it("should allow admin to create blog posts", () => {
      // Login as admin first
      cy.contains("Connexion Admin").click();
      cy.get("#email").type("admin@example.com");
      cy.get("#password").type("admin123");
      cy.get("form").submit();

      // Navigate to posts section
      cy.contains("Articles de Blog").click();

      // Check for create post button
      cy.contains("Ajouter un article").should("be.visible");
    });
  });

  describe("Navigation and UI", () => {
    it("should navigate between registration and login views", () => {
      // Start on registration page
      cy.contains("Formulaire d'Inscription").should("be.visible");

      // Navigate to login
      cy.contains("Connexion Admin").click();
      cy.contains("Connexion Admin").should("be.visible");

      // Navigate back to registration
      cy.contains("Retour à l'inscription").click();
      cy.contains("Formulaire d'Inscription").should("be.visible");
    });

    it("should handle logout correctly", () => {
      // Login as admin
      cy.contains("Connexion Admin").click();
      cy.get("#email").type("admin@example.com");
      cy.get("#password").type("admin123");
      cy.get("form").submit();

      // Should be in admin panel
      cy.contains("Panel d'Administration").should("be.visible");

      // Logout
      cy.contains("Déconnexion").click();

      // Should return to registration page
      cy.contains("Formulaire d'Inscription").should("be.visible");
    });

    it("should show documentation link", () => {
      cy.contains("Documentation").should("be.visible");
      cy.get('a[href="/react-form/docs/index.html"]').should("be.visible");
    });
  });

  describe("API Integration", () => {
    it("should make successful API calls to backend", () => {
      // Test registration API call
      cy.intercept("POST", "**/register").as("registerUser");

      cy.get("#firstName").type("API");
      cy.get("#lastName").type("Test");
      cy.get("#email").type("api.test@example.com");
      cy.get("#birthDate").type("1990-01-01");
      cy.get("#city").type("Paris");
      cy.get("#postalCode").type("75001");
      cy.get("form").submit();

      cy.wait("@registerUser").its("response.statusCode").should("eq", 200);
    });

    it("should handle API errors gracefully", () => {
      // Test login with invalid credentials
      cy.intercept("POST", "**/login").as("loginUser");

      cy.contains("Connexion Admin").click();
      cy.get("#email").type("invalid@example.com");
      cy.get("#password").type("wrongpassword");
      cy.get("form").submit();

      cy.wait("@loginUser").its("response.statusCode").should("eq", 200);
      cy.contains("Invalid credentials").should("be.visible");
    });
  });
});
