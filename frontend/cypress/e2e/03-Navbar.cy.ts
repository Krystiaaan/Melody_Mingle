describe('Navbar Component', () => {
  beforeEach(() => {
    // Assuming the login process is the same as before
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="eMail"]').type('wee@ex.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('form').submit();
    cy.url().should('include', '/melodymingle');
  });

  it('should navigate to the Discover page when logo is clicked', () => {
    cy.visit('http://localhost:5173/melodymingle');
    cy.get('img[alt="Melody Mingle Logo"]').click();
    cy.url().should('include', '/melodymingle');
  });

  it('should open and close the EventsDrawer', () => {
    cy.visit('http://localhost:5173/melodymingle');
    cy.contains('Events').click();
    cy.get('button').contains('Events').should('be.visible');

    cy.contains('New Event').should('be.visible');

    // Find the button with the image containing 'left.png' and click it to close the drawer
    cy.get('button').find('img[src*="left.png"]').click();
    
  });


  it('should open and close the FriendsDrawer', () => {
    cy.visit('http://localhost:5173/melodymingle');
    
    // Open the FriendsDrawer
    cy.get('img[alt="Messenger"]').click();
    
    // Verify the drawer is open by checking the visibility of the "Minglers" button
    cy.get('button').contains('Minglers').should('be.visible');
    
    // Switch to the "Groups" view
    cy.get('button').contains('Groups').click();
    
    // Verify the "Groups" view is active
    cy.get('button').contains('Groups').should('have.css', 'background-color', 'rgb(244, 238, 255)'); 
    
    // Close the drawer by clicking the close button (image)
    cy.get('img[src*="right.png"]').click();
  
  });

  
  it('should open and close the ProfileDrawer', () => {
    cy.visit('http://localhost:5173/melodymingle');
    cy.get('img[alt="User"]').click();
    cy.get('button').contains('Settings').should('be.visible');

    // Close the drawer
    cy.get('button').find('img[src*="right.png"]').click();
  });
});
