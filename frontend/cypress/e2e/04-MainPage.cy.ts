describe('MainPage', () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit('http://localhost:5173/login');

    // Perform login
    cy.get('input[name="eMail"]').type('wee@ex.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('form').submit();

    // Ensure the user is redirected to the main page after login
    cy.url().should('include', '/melodymingle');
    cy.contains('Discover').should('be.visible');
  });
  it('should display user cards and allow swiping', () => {
    cy.visit('http://localhost:5173/melodymingle');

    // Select the first card using its unique attributes
    cy.get('.chakra-card').first().as('firstCard');

    // Check if the first user card is displayed
    cy.get('@firstCard').find('.chakra-heading').should('be.visible');

    // Perform a swipe left
    cy.get('@firstCard')
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', { clientX: 300, clientY: 100 })
      .trigger('mouseup');

    // Check if the next card is displayed
    cy.get('.chakra-card').first().find('.chakra-heading').should('not.have.text', 'First User');
  });
  it('should show Card info if available', () => {
    cy.visit('http://localhost:5173/melodymingle');

    // Wait for the user cards to load and check for Spotify info
    cy.get('.chakra-card').should('exist').then(() => {
      cy.contains('Genre Preferences').should('be.visible');
      cy.contains('About me').should('be.visible');
    });
  });
  it('should handle "LIKE" and "SKIP" button clicks', () => {
    cy.visit('http://localhost:5173/melodymingle');
    cy.contains('LIKE').click();
    cy.contains('You swiped left').should('be.visible');

    cy.contains('SKIP').click();
    cy.contains('You swiped right').should('be.visible');
  });

});