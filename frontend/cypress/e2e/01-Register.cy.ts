describe('RegisterCard Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/register')
  });

  it('should display the registration form', () => {
    cy.get('form').should('be.visible');
  });
  it('should navigate to the login page when "Login now!" link is clicked', () => {

    cy.contains('Already have an account? Login now!').should('be.visible');

    cy.contains('Login now!').click();

    cy.url().should('include', '/login');

    cy.contains('Login').should('be.visible'); 
  });
  it('should display an error message when the form is submitted without any input', () => {
    cy.get('form').submit();
    cy.contains('Required').should('be.visible');
    cy.contains('Required').should('be.visible');
    cy.contains('Required').should('be.visible');
    cy.contains('Required').should('be.visible');
    cy.contains('Required').should('be.visible');
});
  it('should validate the email format', () => {
    cy.get('input[name="eMail"]').type('invalid-email');
    cy.get('form').submit();
    cy.contains('Invalid email format').should('be.visible');
  });

  it('should validate password and confirm password match', () => {
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="eMail"]').type('test@gmail.com');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('differentPassword');
    cy.get('form').submit();
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('should successfully navigate through the entire registration process', () => {
    // Step 1: RegisterCard
    cy.get('input[name="username"]').type('TestttCypress');
    cy.get('input[name="eMail"]').type('wee@ex.com');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Tell us about you').should('be.visible');

    cy.get('input[name="firstname"]').type('Max');
    cy.get('input[name="lastname"]').type('Mustermann');
    cy.get('select[name="city"]').select('Frankfurt');
    cy.get('select[name="state"]').select('Hessen');
    cy.get('button[type="submit"]').click();
    cy.contains('What is your Gender?').should('be.visible');

    cy.get('input[name="gender"]').check('male', { force: true });
    cy.get('button[type="submit"]').click();
    cy.contains('What do you listen to?').should('be.visible');

    cy.get('[data-cy="genre-Pop"]').click();
    cy.get('[data-cy="genre-Hip Hop"]').click();
    cy.get('[data-cy="genre-Jazz"]').click();
    cy.get('button[type="submit"]').click();

    cy.contains('Discover').should('be.visible');
  });
  it('should register userA successfully', () => {
    cy.get('input[name="username"]').type('userA');
    cy.get('input[name="eMail"]').type('userA@ex.com');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    cy.get('input[name="password"]').type('passwordA');
    cy.get('input[name="confirmPassword"]').type('passwordA');
    cy.get('button[type="submit"]').click();
    cy.contains('Tell us about you').should('be.visible');

    cy.get('input[name="firstname"]').type('UserAFirst');
    cy.get('input[name="lastname"]').type('UserALast');
    cy.get('select[name="city"]').select('Frankfurt');
    cy.get('select[name="state"]').select('Hessen');
    cy.get('button[type="submit"]').click();
    cy.contains('What is your Gender?').should('be.visible');

    cy.get('input[name="gender"]').check('male', { force: true });
    cy.get('button[type="submit"]').click();
    cy.contains('What do you listen to?').should('be.visible');

    cy.get('[data-cy="genre-Pop"]').click();
    cy.get('[data-cy="genre-Hip Hop"]').click();
    cy.get('[data-cy="genre-Jazz"]').click();
    cy.get('button[type="submit"]').click();

    cy.contains('Discover').should('be.visible');
  });

  it('should register userB successfully', () => {
    cy.get('input[name="username"]').type('userB');
    cy.get('input[name="eMail"]').type('userB@ex.com');
    cy.get('input[name="dateOfBirth"]').type('1990-01-01');
    cy.get('input[name="password"]').type('passwordB');
    cy.get('input[name="confirmPassword"]').type('passwordB');
    cy.get('button[type="submit"]').click();
    cy.contains('Tell us about you').should('be.visible');

    cy.get('input[name="firstname"]').type('UserBFirst');
    cy.get('input[name="lastname"]').type('UserBLast');
    cy.get('select[name="city"]').select('Frankfurt');
    cy.get('select[name="state"]').select('Hessen');
    cy.get('button[type="submit"]').click();
    cy.contains('What is your Gender?').should('be.visible');

    cy.get('input[name="gender"]').check('female', { force: true });
    cy.get('button[type="submit"]').click();
    cy.contains('What do you listen to?').should('be.visible');

    cy.get('[data-cy="genre-Pop"]').click();
    cy.get('[data-cy="genre-Hip Hop"]').click();
    cy.get('[data-cy="genre-Jazz"]').click();
    cy.get('button[type="submit"]').click();

    cy.contains('Discover').should('be.visible');
  });
});
