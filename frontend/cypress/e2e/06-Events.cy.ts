describe('Events Feature', () => {
  before(() => {
    // Login only once before all tests
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="eMail"]').type('userA@ex.com');
    cy.get('input[name="password"]').type('passwordA');
    cy.get('button[type="submit"]').click();
    
    // Ensure we are on the main page after login
    cy.url().should('not.include', 'login');
  });

  it('should perform a full lifecycle of an event', () => {

    cy.visit('http://localhost:5173/melodymingle');
    cy.contains('Events').click();
    cy.contains('New Event').should('be.visible');

    cy.get('button').contains('New Event').click();
    cy.get('input[name="eventName"]').type('Cypress Test Event');
    cy.get('select[name="eventType"]').select('Concert');
    cy.get('input[name="startDate"]').type('2024-08-10');
    cy.get('input[name="endDate"]').type('2024-08-12');
    cy.get('input[name="location"]').type('Berlin, Germany');
    cy.get('textarea[name="description"]').type('This is a test event created by Cypress.');
    cy.get('input[type="radio"][value="false"]').check({force: true}); // Set event to private
    cy.get('button').contains('Create Event').click();
    cy.contains('Cypress Test Event').should('be.visible');


    cy.contains('Cypress Test Event').click();
    cy.contains('Cypress Test Event').should('be.visible');
    cy.contains('This is a test event created by Cypress.').should('be.visible');

    cy.get('button').contains('Options').click();

    cy.get('input[name="eventName"]').should('be.visible').clear().type('Updated Cypress Test Event');
    cy.get('textarea[name="description"]').should('be.visible').clear().type('This event has been updated by Cypress.');

    cy.get('button').contains('Update Event').click();

    cy.contains('Updated Cypress Test Event').should('be.visible');

    cy.get('button').contains('Options').click();
    cy.get('button').contains('Delete Event').click();
    cy.contains('Event "Updated Cypress Test Event" has been deleted.').should('be.visible');

  });
});
