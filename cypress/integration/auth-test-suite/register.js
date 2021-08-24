describe("renders the register page", () => {
  const randomUserGenerator = Math.random().toString(36).substr(2, 9);

  const mock_data = {
    username: `${randomUserGenerator}`,
    existing_username: `testuser`,
    email: `${randomUserGenerator}@test.com`,
    existing_email: "testuser@test.com",
    password: "1234567890",
    wrong_password: "0000000000",
    register_url: "/register",
    success_url: "/",
  }

  beforeEach(() => {
    cy.visit(mock_data.register_url);
    cy.clearCookies()
    cy.clearLocalStorage() 
  });

  it("Success", () => {
    cy.get('[data-test=username]').clear();
    cy.get('[data-test=username]').type(mock_data.username);
    cy.get('[data-test=email]').clear();
    cy.get('[data-test=email]').type(mock_data.email);
    cy.get('[data-test=password]').clear();
    cy.get('[data-test=password]').type('test12345');
    cy.get('[data-test=cpassword]').clear();
    cy.get('[data-test=cpassword]').type('test12345');
    cy.get('.btn-primary > .buttons').click();
    cy.url().should("contain", mock_data.success_url);
  });

  it("Password Does Not Match", () => {
   cy.get('[data-test=username]').clear();
   cy.get('[data-test=username]').type(mock_data.existing_username);
   cy.get('[data-test=email]').clear();
   cy.get('[data-test=email]').type(mock_data.existing_email);
   cy.get('[data-test=password]').clear();
   cy.get('[data-test=password]').type(mock_data.password);
   cy.get('[data-test=cpassword]').clear();
   cy.get('[data-test=cpassword]').type(mock_data.wrong_password);
   cy.get('.btn-primary > .buttons').click();
   cy.url().should("contain", mock_data.register_url);
   cy.get('.error_div > p')
     .should("have.text", "Password is invalid")
  });

  it("User Already Exists", () => {
   cy.get('[data-test=username]').clear();
   cy.get('[data-test=username]').type(mock_data.existing_username);
   cy.get('[data-test=email]').clear();
   cy.get('[data-test=email]').type(mock_data.existing_email);
   cy.get('[data-test=password]').clear();
   cy.get('[data-test=password]').type(mock_data.password);
   cy.get('[data-test=cpassword]').clear();
   cy.get('[data-test=cpassword]').type(mock_data.password);
   cy.get('.btn-primary > .buttons').click();
   cy.url().should("contain", mock_data.register_url);
   cy.get('.error_div > p')
     .should("have.text", "The email address is already in use by another account.")
  });

});
