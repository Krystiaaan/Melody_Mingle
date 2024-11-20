/// <reference types="cypress" />

describe('Matching Process', () => {
  const userA = {
    username: 'userA',
    email: 'userA@ex.com',
    password: 'passwordA',
    id: 'userAId',
  };

  const userB = {
    username: 'userB',
    email: 'userB@ex.com',
    password: 'passwordB',
    id: 'userBId',
  };

  const login = (email: string, password: string) => {
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="eMail"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('form').submit();
    cy.url().should('include', '/melodymingle');
    cy.contains('Discover').should('be.visible');
  };

  const clickLikeOnUser = (username: string) => {
    cy.contains(username).parents('.chakra-card').as('targetCard');
    cy.get('@targetCard').within(() => {
      cy.contains('LIKE').click(); 
    });
  };

  it('should match two users when they like each other', () => {
    login(userA.email, userA.password);
    clickLikeOnUser(userB.username); 

    cy.logout(); 

    login(userB.email, userB.password);
    clickLikeOnUser(userA.username); 
    cy.logout(); 

    login(userA.email, userA.password);
    cy.get('img[alt="Messenger"]').click();
    cy.contains(userB.username).should('be.visible'); 
  });
});
