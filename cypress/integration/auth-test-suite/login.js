describe("renders the login page", () => {
  
  const mock_data = {
    username: "testuser@test.com",
    correct_password: "1234567890",
    wrong_password: "0000000000",
    login_url: "/login",
    success_url: "/chat",
  }

  it("Password Incorrect", () => {
    cy.visit(mock_data.login_url);
    cy.get('[data-test=email]').clear();
    cy.get('[data-test=email]').type(mock_data.username);
    cy.get('[data-test=password]').clear();
    cy.get('[data-test=password]').type(mock_data.wrong_password);
    cy.get(".btn-primary > .buttons").click();
    cy.url().should("contain", mock_data.login_url);
    cy.get(".error_div > p").should(
      "have.text",
      "The password is invalid or the user does not have a password."
    );
  });

  it("Success", () => {
    cy.get('[data-test=email]').clear();
    cy.get('[data-test=email]').type(mock_data.username);
    cy.get('[data-test=password]').clear();
    cy.get('[data-test=password]').type(mock_data.correct_password);
    cy.get(".btn-primary > .buttons").click(); 
    cy.url().should("contain", mock_data.success_url);
  });


  it("LogOut and Clear Cookies", () => {
     cy.get('.desktop-logout--btn').click(); 
     cy.clearCookies()
     cy.clearLocalStorage() 
  });


});
