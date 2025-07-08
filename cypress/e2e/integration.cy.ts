describe("Complete Integration Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForAppReady();
  });

  it("should complete full user registration and admin management workflow", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser1;

      // Register a new user
      cy.get("#firstName").type(testUser.firstName);
      cy.get("#lastName").type(testUser.lastName);
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type(testUser.birthDate);
      cy.get("#city").type(testUser.city);
      cy.get("#postalCode").type(testUser.postalCode);
      cy.get("form").submit();
      cy.contains("Registration successful!").should("be.visible");

      // Login as admin
      cy.contains("Admin Login").click();
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

      cy.get("#firstName").type(invalidUser.firstName);
      cy.get("#lastName").type(invalidUser.lastName);
      cy.get("#email").type(invalidUser.email);
      cy.get("#birthDate").type(invalidUser.birthDate);
      cy.get("#city").type(invalidUser.city);
      cy.get("#postalCode").type(invalidUser.postalCode);
      cy.get("form").submit();

      cy.contains("Please correct the errors in the form").should("be.visible");
    });
  });

  it("should test admin authentication flow", () => {
    cy.fixture("users").then((users) => {
      const adminUser = users.admin;

      // Try to access admin panel without login
      cy.visit("/admin");
      cy.contains("Unauthorized Access").should("be.visible");
      cy.contains("Please log in to access the admin panel").should("be.visible");

      // Login as admin
      cy.contains("Admin Login").click();
      cy.get("#email").type(adminUser.email);
      cy.get("#password").type(adminUser.password);
      cy.get("form").submit();

      cy.contains("Admin Panel").should("be.visible");
    });
  });

  it("should test user registration with duplicate email", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser1;

      // Register first user
      cy.get("#firstName").type(testUser.firstName);
      cy.get("#lastName").type(testUser.lastName);
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type(testUser.birthDate);
      cy.get("#city").type(testUser.city);
      cy.get("#postalCode").type(testUser.postalCode);
      cy.get("form").submit();
      cy.contains("Registration successful!").should("be.visible");

      // Try to register with same email
      cy.get("#firstName").type("Another");
      cy.get("#lastName").type("User");
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type("1995-01-01");
      cy.get("#city").type("Another City");
      cy.get("#postalCode").type("54321");
      cy.get("form").submit();

      cy.contains("Email already registered").should("be.visible");
    });
  });

  it("should test responsive design and accessibility", () => {
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
  });

  it("should test admin panel user management features", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser2;

      // Register a user
      cy.get("#firstName").type(testUser.firstName);
      cy.get("#lastName").type(testUser.lastName);
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type(testUser.birthDate);
      cy.get("#city").type(testUser.city);
      cy.get("#postalCode").type(testUser.postalCode);
      cy.get("form").submit();
      cy.contains("Registration successful!").should("be.visible");

      // Login as admin
      cy.contains("Admin Login").click();
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
