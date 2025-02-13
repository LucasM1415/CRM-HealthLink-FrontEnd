describe('Entrar em uma consulta de emergência', () => {
    beforeEach(() => {
      cy.loginMedico();
    });

    it('Consulta de Prontidão', () => {
      // Confirmação de que está na seção de paciente
      cy.get('ul > :nth-child(2) > a').should('be.visible');
      cy.get('ul > :nth-child(2) > a').click();

      cy.url().should('include', '/chamadaMedicoProntidao.html');
  
      // Verificar se os botões de câmera e microfone estão visíveis
      cy.get('#micButton').should('be.visible');
      cy.get('#camButton').should('be.visible');
      cy.wait(1000)

      cy.get('header > .back-button').click({ force: true })

 
    });
    
   

  });