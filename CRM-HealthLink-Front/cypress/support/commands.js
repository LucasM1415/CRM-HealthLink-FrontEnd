// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


//////////////////Funções Globais//////////////////////////////

//Clicar no botão de login da HomePage
Cypress.Commands.add('acessarLogin', () => {
    cy.visit('/index.html'); 
    cy.get('li.nav-item.active a.nav-link[href="/pages/login.html"]').first().click();
    cy.url().should('include', '/pages/login.html');
  });

//Logar como paciente
Cypress.Commands.add('loginPaciente', () => {
    cy.acessarLogin(); 
    cy.get('#email').type('patient@email.com');
    cy.get('#password').type('123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/home/patientPage.html');
  });
  
// Logar como gerente
Cypress.Commands.add('loginGerente', () => {
  cy.acessarLogin(); 
  cy.get('#email').type('admin@email.com'); // Ajuste conforme necessário
  cy.get('#password').type('123'); // Ajuste conforme necessário
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/home/managerPage.html'); // Ajuste conforme a URL correta
});

// Logar como atendente
Cypress.Commands.add('loginAtendente', () => {
  cy.acessarLogin(); 
  cy.get('#email').type('att@email.com'); // Ajuste conforme necessário
  cy.get('#password').type('123'); // Ajuste conforme necessário
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/home/attendantPage.html'); // Ajuste conforme a URL correta
});

// Logar como Médico
Cypress.Commands.add('loginMedico', () => {
  cy.acessarLogin(); 
  cy.get('#email').type('doctor@email.com'); // Ajuste conforme necessário
  cy.get('#password').type('123'); // Ajuste conforme necessário
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/home/doctorPage.html'); // Ajuste conforme a URL correta
});