// Login.cy.ts

describe('LoginCard Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });
  
  it('should display the login form', () => {
    cy.get('form').should('be.visible');
  });
  it('should navigate to the registration page when "Register now!" link is clicked', () => {
    cy.contains('Don\'t have an account? Register now!').should('be.visible');
    cy.contains('Register now!').click();
    cy.url().should('include', '/register');
    cy.contains('Register').should('be.visible');
  });
  it('should display an error message for invalid email format', () => {
    cy.get('input[name="eMail"]').type('invalid-email');
    cy.get('form').submit();
    cy.contains('Invalid email format').should('be.visible');
  });

  it('should display an error message when incorrect credentials are provided', () => {
    cy.get('input[name="eMail"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('form').submit();

    cy.get('.chakra-toast') 
      .should('exist')
      .contains('invalid email or password')
      .should('be.visible');
  });

  it('should successfully log in with correct credentials', () => {
    cy.get('input[name="eMail"]').type('userA@ex.com');
    cy.get('input[name="password"]').type('passwordA');
    cy.get('form').submit();

    cy.url().should('include', '/melodymingle');
    cy.contains('Discover').should('be.visible'); 
  });
});
