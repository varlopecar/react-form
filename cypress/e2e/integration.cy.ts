describe("Complete Integration Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForAppReady();
  });

  // Helper function to open registration form
  const openRegistrationForm = () => {
    cy.contains("User Registration").click(); // Clique sur l'onglet User Registration
    cy.wait(1000); // Attendre que l'onglet soit actif
    cy.contains("Create User").click(); // Ouvre le formulaire
    cy.wait(500); // Attendre que la modal s'ouvre
  };

  // Helper function to close modal if open
  const closeModalIfOpen = () => {
    cy.get('body').then(($body) => {
      if ($body.find('.MuiDialog-container').length > 0) {
        // Cliquer sur le bouton Cancel dans la modal
        cy.contains('button', 'Cancel').click();
        cy.wait(500);
      }
    });
  };

  it("should complete full user registration and admin management workflow", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser1;

      // Open registration form
      openRegistrationForm();

      // Register a new user
      cy.get("#firstName").type(testUser.firstName);
      cy.get("#lastName").type(testUser.lastName);
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type(testUser.birthDate);
      cy.get("#city").type(testUser.city);
      cy.get("#postalCode").type(testUser.postalCode);
      cy.get("form").submit();
      cy.contains("Registration successful!", {timeout: 7000}).should("be.visible");
      cy.wait(1000);

      // Close modal and navigate to admin
      closeModalIfOpen();
      cy.wait(1000);
      
      // Navigate to admin login page
      cy.visit("/admin/login");
      cy.wait(1000);
      
      // Login as admin
      cy.get("#email").type(users.admin.email);
      cy.get("#password").type(users.admin.password);
      cy.get("form").submit();

      // Verify user is in admin panel
      cy.contains("Admin Panel").should("be.visible");
      cy.contains(`${testUser.firstName} ${testUser.lastName}`).should("be.visible");

      // Delete the user
      cy.contains(`${testUser.firstName} ${testUser.lastName}`)
        .parent()
        .parent()
        .within(() => {
          cy.get('[data-testid="delete-button"]').click();
        });

      cy.on("window:confirm", () => true);
      cy.contains("User deleted successfully").should("be.visible");
    });
  });

  it("should handle form validation errors using fixtures", () => {
    cy.fixture("users").then((users) => {
      const invalidUser = users.invalidUser;

      // Open registration form
      openRegistrationForm();

      cy.get("#firstName").type(invalidUser.firstName);
      cy.get("#lastName").type(invalidUser.lastName);
      cy.get("#email").type(invalidUser.email);
      cy.get("#birthDate").type(invalidUser.birthDate);
      cy.get("#city").type(invalidUser.city);
      cy.get("#postalCode").type(invalidUser.postalCode);
      cy.get("form").submit();

      cy.contains("Please correct the errors in the form", {timeout: 7000}).should("be.visible");
      cy.wait(1000);
    });
  });

  it("should test admin authentication flow", () => {
    cy.fixture("users").then((users) => {
      const adminUser = users.admin;

      // Try to access admin panel without login
      cy.visit("/admin");
      cy.contains("Unauthorized Access").should("be.visible");
      cy.contains("Please log in to access the admin panel").should("be.visible");

      // Navigate to admin login page
      cy.visit("/admin/login");
      cy.wait(1000);
      
      // Login as admin
      cy.get("#email").type(adminUser.email);
      cy.get("#password").type(adminUser.password);
      cy.get("form").submit();

      // Look for admin panel content
      cy.contains("Admin Panel").should("be.visible");
    });
  });

  it("should test user registration with duplicate email", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser1;

      // Open registration form
      openRegistrationForm();

      // Register first user
      cy.get("#firstName").type(testUser.firstName);
      cy.get("#lastName").type(testUser.lastName);
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type(testUser.birthDate);
      cy.get("#city").type(testUser.city);
      cy.get("#postalCode").type(testUser.postalCode);
      cy.get("form").submit();
      cy.contains("Registration successful!", {timeout: 7000}).should("be.visible");
      cy.wait(1000);

      // Close modal and open registration form again for second user
      closeModalIfOpen();
      cy.wait(1000);
      openRegistrationForm();
      cy.wait(500);

      // Try to register with same email
      cy.get("#firstName").type("Another");
      cy.get("#lastName").type("User");
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type("1995-01-01");
      cy.get("#city").type("Another City");
      cy.get("#postalCode").type("54321");
      cy.get("form").submit();

      // Check for error message (could be toast or form error)
      cy.contains("Email already registered", {timeout: 7000}).should("be.visible");
      cy.wait(1000);
    });
  });

  it("should test responsive design and accessibility", () => {
    // Open registration form
    openRegistrationForm();
    cy.wait(500);

    // Test form accessibility
    cy.get("form").should("be.visible");
    cy.get("#firstName").should("be.visible");
    cy.get("#lastName").should("be.visible");
    cy.get("#email").should("be.visible");
    cy.get("#birthDate").should("be.visible");
    cy.get("#city").should("be.visible");
    cy.get("#postalCode").should("be.visible");

    // Test responsive design
    cy.viewport("iphone-6");
    cy.get("form").should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
    cy.wait(500);
  });

  it("should test admin panel user management features", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser2;

      // Open registration form
      openRegistrationForm();

      // Register a user
      cy.get("#firstName").type(testUser.firstName);
      cy.get("#lastName").type(testUser.lastName);
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type(testUser.birthDate);
      cy.get("#city").type(testUser.city);
      cy.get("#postalCode").type(testUser.postalCode);
      cy.get("form").submit();
      cy.contains("Registration successful!", {timeout: 7000}).should("be.visible");
      cy.wait(1000);

      // Close modal and navigate to admin
      closeModalIfOpen();
      cy.wait(1000);
      
      // Navigate to admin login page
      cy.visit("/admin/login");
      cy.wait(1000);
      
      // Login as admin
      cy.get("#email").type(users.admin.email);
      cy.get("#password").type(users.admin.password);
      cy.get("form").submit();

      // Test search functionality
      cy.get('input[placeholder*="Search"]').type(testUser.firstName);
      cy.contains(`${testUser.firstName} ${testUser.lastName}`).should("be.visible");

      // Test user details view
      cy.contains(`${testUser.firstName} ${testUser.lastName}`)
        .parent()
        .parent()
        .within(() => {
          cy.get('[data-testid="view-button"]').click();
        });

      cy.contains("User Details").should("be.visible");
      cy.contains(testUser.email).should("be.visible");
    });
  });
});
