

describe("renders the home page", () => {
  
  const mock_data = {
    username: "testuser@test.com",
    correct_password: "1234567890",
    wrong_password: "0000000000",
    login_url: "/login",
    base_url: "/",
    user_data: {
      uid: "psAwqq9wB5NcP0GpRhy5705Sib52",
      photoUrl: "http://gravatar.com/avatar/ed53e691ee322e24d8cc843fff68ebc6?d=identicon",
      displayName: "TestUser",
      email: "testuser@test.com",
      timestamp: {
        creationTime: "August"
      }
    }
  }


  it("LogIn Dummy User", () => {
    cy.visit(mock_data.login_url);
    cy.get("#inputEmail3").clear();
    cy.get("#inputEmail3").type(mock_data.username);
    cy.get(".fgpasswd > .form-control").clear();
    cy.get(".fgpasswd > .form-control").type(mock_data.correct_password);
    cy.get(".btn-primary > .buttons").click(); 
  })

 

  it("Retrieving Home Data", () => {

     cy.get('.text__img--container--img').and('have.attr', 'src').should("contain",
       `${mock_data.user_data.photoUrl}`)
     cy.get('.language-json > :nth-child(15)').should(
       "have.text", ` ${mock_data.user_data.uid}`
     );
     cy.get('.language-json > :nth-child(20)').should(
       "have.text", ` ${mock_data.user_data.displayName}`
     );
     cy.get('.language-json > :nth-child(25)').should(
       "have.text", ` http`
     );
     cy.get('.language-json > :nth-child(31)').should(
       "contain", `${mock_data.user_data.email}`
     );
     cy.get(':nth-child(41)').should(
       "contain", `${mock_data.user_data.timestamp.creationTime}`);

  });

  it("Route to Chat", () => {
    cy.get('.button__item').click()
  })

});
