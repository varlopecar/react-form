describe("Admin Login Test", () => {
  beforeEach(() => {
    cy.visit("/admin/login");
    cy.wait(1000);
  });

  it("should login as admin and verify redirection", () => {
    cy.fixture("users").then((users) => {
      const adminUser = users.admin;

      // Verify we're on login page
      cy.contains("Admin Login").should("be.visible");
      cy.contains("Please log in to access the admin panel").should("be.visible");

      // Login as admin
      cy.get("#email").type(adminUser.email);
      cy.get("#password").type(adminUser.password);
      cy.get("form").submit();

      // Wait for login to complete and check URL
      cy.wait(3000);
      cy.url().should("include", "/admin");
      
      // Check for admin panel content with multiple possible texts
      cy.contains("Admin Panel", { timeout: 10000 }).should("be.visible");
      
      // Additional checks to ensure we're on the right page
      cy.get("body").should("contain", "Admin Panel");
      
      // Check for admin-specific elements
      cy.get("button").contains("Logout").should("be.visible");
      cy.get("button").contains("Home").should("be.visible");
    });
  });

  it("should show error for invalid credentials", () => {
    // Try to login with invalid credentials
    cy.get("#email").type("invalid@example.com");
    cy.get("#password").type("wrongpassword");
    cy.get("form").submit();

    // Should show error message
    cy.contains("Login failed").should("be.visible");
  });

  it("should test admin page access without login", () => {
    // Try to access admin page directly without login
    cy.visit("/admin");
    
    // Should show unauthorized access message
    cy.contains("Unauthorized Access").should("be.visible");
    cy.contains("Please log in to access the admin panel").should("be.visible");
  });
});
