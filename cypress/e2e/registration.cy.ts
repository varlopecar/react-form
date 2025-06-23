describe("User Registration", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForAppReady();
  });

  it("should display the registration form", () => {
    cy.get("h1").should("contain", "Formulaire d'Inscription");
    cy.get("form").should("be.visible");
    cy.get("#firstName").should("be.visible");
    cy.get("#lastName").should("be.visible");
    cy.get("#email").should("be.visible");
    cy.get("#birthDate").should("be.visible");
    cy.get("#city").should("be.visible");
    cy.get("#postalCode").should("be.visible");
  });

  it("should register a new user successfully using fixtures", () => {
    cy.fixture('users').then((users) => {
      const userData = users.testUser1;
      
      cy.get('#firstName').type(userData.firstName);
      cy.get('#lastName').type(userData.lastName);
      cy.get('#email').type(userData.email);
      cy.get('#birthDate').type(userData.birthDate);
      cy.get('#city').type(userData.city);
      cy.get('#postalCode').type(userData.postalCode);
      
      cy.get('form').submit();
      
      cy.contains('Inscription réussie !').should('be.visible');
    });
  });

  it("should show validation errors for invalid data using fixtures", () => {
    cy.fixture('users').then((users) => {
      const invalidUser = users.invalidUser;
      
      // Fill form with invalid data
      cy.get('#firstName').type(invalidUser.firstName);
      cy.get('#lastName').type(invalidUser.lastName);
      cy.get('#email').type(invalidUser.email);
      cy.get('#birthDate').type(invalidUser.birthDate);
      cy.get('#city').type(invalidUser.city);
      cy.get('#postalCode').type(invalidUser.postalCode);
      
      // Should show validation errors
      cy.get('.text-red-500').should('have.length.at.least', 1);
    });
  });

  it("should validate email format", () => {
  it("should register a new user successfully", () => {
    const userData = {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      birthDate: "1990-05-15",
      city: "Paris",
      postalCode: "75001",
    };

    cy.registerUser(userData);
  });

  it("should show validation errors for invalid data", () => {
    // Try to submit empty form
    cy.get("form").submit();

    // Should show validation errors
    cy.get(".text-red-500").should("have.length.at.least", 1);
  });

  it("should validate email format", () => {
    cy.get("#email").type("invalid-email");
    cy.get("#email").blur();
    cy.contains("L'email n'est pas valide").should("be.visible");
  });

  it("should validate age requirement (18+)", () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toISOString().split("T")[0];

    cy.get("#birthDate").type(futureDateString);
    cy.get("#birthDate").blur();
    cy.contains("Vous devez avoir au moins 18 ans").should("be.visible");
  });

  it("should validate postal code format", () => {
    cy.get("#postalCode").type("123");
    cy.get("#postalCode").blur();
    cy.contains("Le code postal doit contenir 5 chiffres").should("be.visible");
  });

  it("should enable submit button only when all fields are filled", () => {
    // Initially button should be disabled
    cy.get('button[type="submit"]').should("be.disabled");

    // Fill all fields
    cy.get("#firstName").type("Jean");
    cy.get("#lastName").type("Dupont");
    cy.get("#email").type("jean@example.com");
    cy.get("#birthDate").type("1990-05-15");
    cy.get("#city").type("Paris");
    cy.get("#postalCode").type("75001");

    // Button should now be enabled
    cy.get('button[type="submit"]').should("not.be.disabled");
  });

  it("should handle duplicate email registration", () => {
    const userData = {
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@example.com",
      birthDate: "1985-10-20",
      city: "Lyon",
      postalCode: "69001",
    };

    // Register first user
    cy.registerUser(userData);

    // Try to register with same email
    cy.visit("/");
    cy.registerUser(userData);

    // Should show error message
    cy.contains("Email already registered").should("be.visible");
  });
});
