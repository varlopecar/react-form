describe("User Registration", () => {
  beforeEach(() => {
    cy.visit("/"); // Page d'accueil
    cy.contains("User Registration").click(); // Clique sur l'onglet User Registration
    cy.contains("Create User").click(); // Ouvre le formulaire
  });

  it("should display the registration form", () => {
    cy.contains("Registration Form").should("be.visible");
    cy.get("form").should("be.visible");
  });

  it("should register a new user successfully using fixtures", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser1;

      cy.get("#firstName").type(testUser.firstName);
      cy.get("#lastName").type(testUser.lastName);
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type(testUser.birthDate);
      cy.get("#city").type(testUser.city);
      cy.get("#postalCode").type(testUser.postalCode);
      cy.get("form").submit();

      cy.contains("Registration successful!").should("be.visible");
    });
  });

  it("should show validation errors for invalid data using fixtures", () => {
    cy.fixture("users").then((users) => {
      const invalidUser = users.invalidUser;

      cy.get("#firstName").type(invalidUser.firstName);
      cy.get("#lastName").type(invalidUser.lastName);
      cy.get("#email").type(invalidUser.email);
      cy.get("#birthDate").type(invalidUser.birthDate);
      cy.get("#city").type(invalidUser.city);
      cy.get("#postalCode").type(invalidUser.postalCode);
      cy.get("form").submit();

      // Should show validation errors
      cy.contains("Please correct the errors in the form").should("be.visible");
    });
  });

  it("should validate email format", () => {
    cy.get("#email").type("invalid-email");
    cy.get("#email").blur();
    cy.contains("Email is not valid").should("be.visible");
  });

  it("should register a new user successfully", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser2;

      cy.get("#firstName").type(testUser.firstName);
      cy.get("#lastName").type(testUser.lastName);
      cy.get("#email").type(testUser.email);
      cy.get("#birthDate").type(testUser.birthDate);
      cy.get("#city").type(testUser.city);
      cy.get("#postalCode").type(testUser.postalCode);
      cy.get("form").submit();

      cy.contains("Registration successful!").should("be.visible");
    });
  });

  it("should show validation errors for invalid data", () => {
    cy.get("form").submit();
    cy.contains("Please correct the errors in the form").should("be.visible");
  });

  it("should validate email format", () => {
    cy.get("#email").type("invalid-email");
    cy.get("#email").blur();
    cy.contains("Email is not valid").should("be.visible");
  });

  it("should validate age requirement (18+)", () => {
    const underageDate = new Date();
    underageDate.setFullYear(underageDate.getFullYear() - 17);
    const underageDateString = underageDate.toISOString().split('T')[0];

    cy.get("#birthDate").type(underageDateString);
    cy.get("#birthDate").blur();
    cy.contains("You must be at least 18 years old").should("be.visible");
  });

  it("should validate postal code format", () => {
    cy.get("#postalCode").type("123");
    cy.get("#postalCode").blur();
    cy.contains("Postal code must contain 5 digits").should("be.visible");
  });

  it("should enable submit button only when all fields are filled", () => {
    // Initially, submit button should be disabled
    cy.get('button[type="submit"]').should("be.disabled");

    // Fill all fields
    cy.get("#firstName").type("John");
    cy.get("#lastName").type("Doe");
    cy.get("#email").type("john@example.com");
    cy.get("#birthDate").type("1990-01-01");
    cy.get("#city").type("New York");
    cy.get("#postalCode").type("12345");

    // Submit button should be enabled
    cy.get('button[type="submit"]').should("not.be.disabled");
  });

  it("should handle duplicate email registration", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser1;

      // Register user first time
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
});
