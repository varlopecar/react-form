describe("Frontend-Backend Integration Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForAppReady();
  });

  // Helper function to open registration form
  const openRegistrationForm = () => {
    cy.contains("User Registration").click();
    cy.wait(1000);
    cy.contains("Create User").click();
    cy.wait(500);
  };

  // Helper function to close modal if open
  const closeModalIfOpen = () => {
    cy.get('body').then(($body) => {
      if ($body.find('.MuiDialog-container').length > 0) {
        cy.contains('button', 'Cancel').click();
        cy.wait(500);
      }
    });
  };

  describe("User Registration", () => {
    it("should register a new user successfully", () => {
      openRegistrationForm();

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
      cy.contains("Registration successful!", { timeout: 7000 }).should("be.visible");
    });

    it("should show validation errors for invalid data", () => {
      openRegistrationForm();

      // Try to submit empty form
      cy.get("form").submit();

      // Check for validation errors - using the actual messages from the schema
      cy.contains("First name must contain at least 2 characters").should("be.visible");
      cy.contains("Last name must contain at least 2 characters").should("be.visible");
      cy.contains("Email is not valid").should("be.visible");
    });

    it("should prevent duplicate email registration", () => {
      openRegistrationForm();

      // Register first user
      cy.get("#firstName").type("Jane");
      cy.get("#lastName").type("Smith");
      cy.get("#email").type("jane.smith@example.com");
      cy.get("#birthDate").type("1995-05-15");
      cy.get("#city").type("Lyon");
      cy.get("#postalCode").type("69001");
      cy.get("form").submit();
      cy.contains("Registration successful!", { timeout: 7000 }).should("be.visible");

      // Close modal and open registration form again
      closeModalIfOpen();
      openRegistrationForm();

      // Try to register with same email
      cy.get("#firstName").type("Jane2");
      cy.get("#lastName").type("Smith2");
      cy.get("#email").type("jane.smith@example.com"); // Same email
      cy.get("#birthDate").type("1995-05-15");
      cy.get("#city").type("Marseille");
      cy.get("#postalCode").type("13001");
      cy.get("form").submit();

      // Should show error for duplicate email
      cy.contains("Email already registered", { timeout: 7000 }).should("be.visible");
    });
  });

  describe("User Login", () => {
    beforeEach(() => {
      // Navigate to admin login page
      cy.visit("/admin/login");
      cy.wait(1000);
    });

    it("should login with valid admin credentials", () => {
      cy.fixture("users").then((users) => {
        // Login with admin credentials
        cy.get("#email").type(users.admin.email);
        cy.get("#password").type(users.admin.password);
        cy.get("form").submit();

        // Should redirect to admin panel
        cy.url().should("include", "/admin");
        cy.contains("Admin Panel", { timeout: 10000 }).should("be.visible");
      });
    });

    it("should show error for invalid credentials", () => {
      cy.get("#email").type("invalid@example.com");
      cy.get("#password").type("wrongpassword");
      cy.get("form").submit();

      // Should show error message
      cy.contains("Login failed").should("be.visible");
    });
  });

  describe("Admin Panel and User Management", () => {
    beforeEach(() => {
      // Login as admin
      cy.visit("/admin/login");
      cy.wait(1000);
      cy.fixture("users").then((users) => {
        cy.get("#email").type(users.admin.email);
        cy.get("#password").type(users.admin.password);
        cy.get("form").submit();
        cy.contains("Admin Panel", { timeout: 10000 }).should("be.visible");
      });
    });

    it("should display users table with registered users", () => {
      // Check that the users table is displayed
      cy.contains("Users").should("be.visible");
      cy.get("table").should("be.visible");

      // Should show at least the admin user
      cy.contains("admin@example.com").should("be.visible");
    });

    it("should allow admin to delete non-admin users", () => {
      // First register a test user
      cy.visit("/");
      openRegistrationForm();
      cy.get("#firstName").type("Delete");
      cy.get("#lastName").type("User");
      cy.get("#email").type("delete.user@example.com");
      cy.get("#birthDate").type("1990-01-01");
      cy.get("#city").type("Paris");
      cy.get("#postalCode").type("75001");
      cy.get("form").submit();
      cy.contains("Registration successful!", { timeout: 7000 }).should("be.visible");

      // Login as admin again
      cy.visit("/admin/login");
      cy.wait(1000);
      cy.fixture("users").then((users) => {
        cy.get("#email").type(users.admin.email);
        cy.get("#password").type(users.admin.password);
        cy.get("form").submit();
        cy.contains("Admin Panel", { timeout: 10000 }).should("be.visible");
      });

      // Check that the new user appears in the table
      cy.contains("delete.user@example.com").should("be.visible");

      // Delete the user
      cy.contains("delete.user@example.com")
        .parent()
        .parent()
        .within(() => {
          cy.get('[data-testid="delete-button"]').click();
        });

      // Confirm deletion
      cy.on("window:confirm", () => true);

      // Check success message
      cy.contains("User deleted successfully").should("be.visible");

      // User should be removed from table
      cy.contains("delete.user@example.com").should("not.exist");
    });
  });

  describe("Blog Posts Integration", () => {
    it("should display blog posts on the main page", () => {
      // Check that blog posts are displayed
      cy.contains("Blog Posts").should("be.visible");
      
      // Should show posts section (check for the actual component)
      cy.get('[role="tabpanel"]').should("be.visible");
    });

    it("should allow admin to create blog posts", () => {
      // Login as admin first
      cy.visit("/admin/login");
      cy.wait(1000);
      cy.fixture("users").then((users) => {
        cy.get("#email").type(users.admin.email);
        cy.get("#password").type(users.admin.password);
        cy.get("form").submit();
        cy.contains("Admin Panel", { timeout: 10000 }).should("be.visible");
      });

      // Navigate to posts section
      cy.contains("Posts").click();

      // Check for create post functionality
      cy.contains("Create Post").should("be.visible");
    });
  });

  describe("Navigation and UI", () => {
    it("should navigate between registration and login views", () => {
      // Start on home page
      cy.contains("User Registration").should("be.visible");

      // Navigate to admin login
      cy.visit("/admin/login");
      cy.contains("Admin Login").should("be.visible");

      // Navigate back to home
      cy.visit("/");
      cy.contains("User Registration").should("be.visible");
    });

    it("should handle logout correctly", () => {
      // Login as admin
      cy.visit("/admin/login");
      cy.wait(1000);
      cy.fixture("users").then((users) => {
        cy.get("#email").type(users.admin.email);
        cy.get("#password").type(users.admin.password);
        cy.get("form").submit();
        cy.contains("Admin Panel", { timeout: 10000 }).should("be.visible");
      });

      // Logout
      cy.contains("Logout").click();

      // Should return to home page
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });

  describe("API Integration", () => {
    it("should make successful API calls to backend", () => {
      // Test registration API call
      cy.intercept("POST", "**/register").as("registerUser");

      openRegistrationForm();
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

      cy.visit("/admin/login");
      cy.get("#email").type("invalid@example.com");
      cy.get("#password").type("wrongpassword");
      cy.get("form").submit();

      cy.wait("@loginUser").its("response.statusCode").should("eq", 200);
      cy.contains("Login failed").should("be.visible");
    });
  });
});
