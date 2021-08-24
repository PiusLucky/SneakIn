

describe("renders the home page", () => {
  const mock_data = {
    username: "testuser@test.com",
    correct_password: "1234567890",
    wrong_password: "0000000000",
    login_url: "/login",
    base_url: "/",
    chat_url: "/chat",
  }


  it("LogIn Dummy User", () => {
    cy.visit(mock_data.login_url);
    cy.get("#inputEmail3").clear();
    cy.get("#inputEmail3").type(mock_data.username);
    cy.get(".fgpasswd > .form-control").clear();
    cy.get(".fgpasswd > .form-control").type(mock_data.correct_password);
    cy.get(".btn-primary > .buttons").click(); 
  })

  it("Route to Chat", () => {
    cy.get('.button__item').click()
    cy.url().should("contain", mock_data.chat_url);
  })

});
