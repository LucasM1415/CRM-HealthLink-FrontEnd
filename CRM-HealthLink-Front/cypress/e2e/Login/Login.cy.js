//As funções globais estão no support/commands.js!!!

describe('Testes da Tela de Login', () => {
  beforeEach(() => {
    cy.acessarLogin(); // Função global para acessar a tela de login
  });

  it('Verifica se os campos de login aparecem corretamente', () => {
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Entrar');
  });

  it('Tenta login inválido e verifica a mensagem de erro', () => {
    cy.get('#email').type('email@invalido.com');
    cy.get('#password').type('senhaincorreta');
    cy.get('button[type="submit"]').click();
  
    // Captura o alert nativo do navegador
    cy.on('window:alert', (msg) => {
      expect(msg).to.contain('Login failed');
    });
  });
  
  ////////////////////////AVISO//////////////////////////////
  /* Devido ao deploy que fizemos em sistemas terceiros, 
  o tempo de resposta pode variar drasticamente,
  aguarde um pouco até que o servidor dê a resposta*/


 // Usando o Paciente como exemplo
it('Realiza login válido', () => {
  cy.get('#email').type('patient@email.com'); 
  cy.get('#password').type('123');
  cy.get('button[type="submit"]').click();

  cy.url().should('include', '/patientPage.html');
});

});
