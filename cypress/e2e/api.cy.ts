describe("API Endpoints", () => {
  beforeEach(() => {
    // Start the backend server for API testing
    cy.visit("/");
  });

  it("should test user registration API endpoint", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser1;

      cy.request({
        method: "POST",
        url: "http://localhost:8000/register",
        body: {
          email: testUser.email,
          password: "password123",
          first_name: testUser.firstName,
          last_name: testUser.lastName,
          birth_date: testUser.birthDate,
          city: testUser.city,
          postal_code: testUser.postalCode,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body).to.have.property("success", true);
        expect(response.body).to.have.property("message", "Inscription réussie !");
        expect(response.body.user).to.have.property("email", testUser.email);
        expect(response.body.user).to.have.property("first_name", testUser.firstName);
        expect(response.body.user).to.have.property("last_name", testUser.lastName);
        expect(response.body.user).to.have.property("is_admin", false);
      });
    });
  });

  it("should test admin login API endpoint", () => {
    cy.fixture("users").then((users) => {
      const adminUser = users.admin;

      cy.request({
        method: "POST",
        url: "http://localhost:8000/login",
        body: {
          email: adminUser.email,
          password: adminUser.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("success", true);
        expect(response.body).to.have.property("access_token");
        expect(response.body).to.have.property("token_type", "bearer");
        expect(response.body.user).to.have.property("is_admin", true);
      });
    });
  });

  it("should test failed login API endpoint", () => {
    cy.fixture("users").then((users) => {
      const invalidUser = users.invalidUser;

      cy.request({
        method: "POST",
        url: "http://localhost:8000/login",
        body: {
          email: invalidUser.email,
          password: invalidUser.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("success", false);
        expect(response.body).to.have.property("error", "Invalid credentials");
      });
    });
  });

  it("should test get users API endpoint (public access)", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8000/users",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);

      // Check if response has the expected structure
      const firstUser = response.body[0];
      expect(firstUser).to.have.property("id");
      expect(firstUser).to.have.property("first_name");
      expect(firstUser).to.have.property("last_name");
      expect(firstUser).to.have.property("email");
      expect(firstUser).to.have.property("is_admin");
    });
  });

  it("should test get public users API endpoint", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8000/public-users",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);

      // Check if response only contains first names
      const firstUser = response.body[0];
      expect(firstUser).to.have.property("first_name");
      expect(Object.keys(firstUser)).to.have.length(1);
    });
  });

  it("should test delete user API endpoint with admin token", () => {
    cy.fixture("users").then((users) => {
      const adminUser = users.admin;
      const testUser = users.testUser2;

      // First register a test user
      cy.request({
        method: "POST",
        url: "http://localhost:8000/register",
        body: {
          email: testUser.email,
          password: "password123",
          first_name: testUser.firstName,
          last_name: testUser.lastName,
          birth_date: testUser.birthDate,
          city: testUser.city,
          postal_code: testUser.postalCode,
        },
      }).then((registerResponse) => {
        const userId = registerResponse.body.user.id;

        // Login as admin
        cy.request({
          method: "POST",
          url: "http://localhost:8000/login",
          body: {
            email: adminUser.email,
            password: adminUser.password,
          },
        }).then((loginResponse) => {
          const token = loginResponse.body.access_token;

          // Delete the test user
          cy.request({
            method: "DELETE",
            url: `http://localhost:8000/users/${userId}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property(
              "message",
              `User ${userId} deleted successfully`
            );
          });
        });
      });
    });
  });

  it("should test duplicate email registration", () => {
    cy.fixture("users").then((users) => {
      const testUser = users.testUser3;

      // Register user first time
      cy.request({
        method: "POST",
        url: "http://localhost:8000/register",
        body: {
          email: testUser.email,
          password: "password123",
          first_name: testUser.firstName,
          last_name: testUser.lastName,
          birth_date: testUser.birthDate,
          city: testUser.city,
          postal_code: testUser.postalCode,
        },
      }).then(() => {
        // Try to register same email again
        cy.request({
          method: "POST",
          url: "http://localhost:8000/register",
          body: {
            email: testUser.email,
            password: "password123",
            first_name: testUser.firstName,
            last_name: testUser.lastName,
            birth_date: testUser.birthDate,
            city: testUser.city,
            postal_code: testUser.postalCode,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property("success", false);
          expect(response.body).to.have.property(
            "error",
            "Email already registered"
          );
        });
      });
    });
  });

  it("should test API root endpoint", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8000/",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("message", "User Management API");
      expect(response.body).to.have.property("version", "1.0.0");
      expect(response.body).to.have.property("status", "running");
    });
  });

  it("should test health check endpoint", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8000/health",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("status");
      expect(response.body).to.have.property("database");
      expect(response.body).to.have.property("timestamp");
    });
  });
});
