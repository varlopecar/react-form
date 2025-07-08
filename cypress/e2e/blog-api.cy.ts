describe("Blog Posts API Endpoints", () => {
  const blogApiUrl = "https://express-mongodb-app-blush.vercel.app";

  beforeEach(() => {
    // Visit the main page to ensure the app is loaded
    cy.visit("/");
  });

  it("should test get blog posts API endpoint", () => {
    cy.request({
      method: "GET",
      url: `${blogApiUrl}/posts`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      
      // Check if posts have the expected structure
      if (response.body.length > 0) {
        const firstPost = response.body[0];
        expect(firstPost).to.have.property("_id");
        expect(firstPost).to.have.property("title");
        expect(firstPost).to.have.property("content");
        expect(firstPost).to.have.property("author");
        expect(firstPost).to.have.property("createdAt");
        expect(firstPost).to.have.property("updatedAt");
      }
    });
  });

  it("should test create blog post API endpoint", () => {
    const newPost = {
      title: "Test Blog Post",
      content: "This is a test blog post content for Cypress testing.",
      author: "Cypress Test User"
    };

    cy.request({
      method: "POST",
      url: `${blogApiUrl}/posts`,
      body: newPost,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      expect(response.body).to.have.property("_id");
      expect(response.body).to.have.property("title", newPost.title);
      expect(response.body).to.have.property("content", newPost.content);
      expect(response.body).to.have.property("author", newPost.author);
      expect(response.body).to.have.property("createdAt");
      expect(response.body).to.have.property("updatedAt");
    });
  });

  it("should test update blog post API endpoint", () => {
    // First create a post
    const newPost = {
      title: "Post to Update",
      content: "Original content",
      author: "Cypress Test User"
    };

    cy.request({
      method: "POST",
      url: `${blogApiUrl}/posts`,
      body: newPost,
      failOnStatusCode: false,
    }).then((createResponse) => {
      const postId = createResponse.body._id;
      const updatedPost = {
        title: "Updated Post Title",
        content: "Updated content",
        author: "Updated Author"
      };

      // Update the post
      cy.request({
        method: "PUT",
        url: `${blogApiUrl}/posts/${postId}`,
        body: updatedPost,
        failOnStatusCode: false,
      }).then((updateResponse) => {
        expect(updateResponse.status).to.equal(200);
        expect(updateResponse.body).to.have.property("_id", postId);
        expect(updateResponse.body).to.have.property("title", updatedPost.title);
        expect(updateResponse.body).to.have.property("content", updatedPost.content);
        expect(updateResponse.body).to.have.property("author", updatedPost.author);
      });
    });
  });

  it("should test delete blog post API endpoint", () => {
    // First create a post
    const newPost = {
      title: "Post to Delete",
      content: "This post will be deleted",
      author: "Cypress Test User"
    };

    cy.request({
      method: "POST",
      url: `${blogApiUrl}/posts`,
      body: newPost,
      failOnStatusCode: false,
    }).then((createResponse) => {
      const postId = createResponse.body._id;

      // Delete the post
      cy.request({
        method: "DELETE",
        url: `${blogApiUrl}/posts/${postId}`,
        failOnStatusCode: false,
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.equal(200);
        expect(deleteResponse.body).to.have.property("message");
      });
    });
  });

  it("should test blog posts API error handling", () => {
    // Test with invalid post ID
    cy.request({
      method: "GET",
      url: `${blogApiUrl}/posts/invalid-id`,
      failOnStatusCode: false,
    }).then((response) => {
      // Should return an error for invalid ID
      expect(response.status).to.not.equal(200);
    });
  });
}); 