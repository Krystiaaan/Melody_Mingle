describe('Profile and Settings Feature', () => {
  before(() => {
    // Login only once before all tests
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="eMail"]').type('wee@ex.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Ensure we are on the main page after login
    cy.url().should('not.include', 'login');
  });

  it('should update profile bio genres and show Card', () => {
    // Open the Profile Drawer
    cy.get('img[alt="User"]').click();
    cy.get('button').contains('Settings').should('be.visible');


    // Navigate to the Settings/Profile page
    cy.get('button').contains('Settings').click();

    // Ensure we are on the Profile page
    cy.url().should('include', '/profile');

    // Display the Profile card
    cy.contains('Profile').should('be.visible');

    cy.get('textarea[name="bio"]').clear().type('This is my updated bio.');
    cy.get('button').contains('Save Changes').click();
    cy.wait(1000);	

    cy.get('button').contains('Your Genres').click();
    cy.get('[data-cy="genre-Pop"]').click();
    cy.get('[data-cy="genre-Hip Hop"]').click();
    cy.get('[data-cy="genre-Jazz"]').click();
    cy.get('button').contains('Finish').click();

    cy.get('button').contains('Show Card').click();
    // Verify that changes are saved and reflected on the Profile page
    cy.contains('This is my updated bio.').should('be.visible');
  });

});
