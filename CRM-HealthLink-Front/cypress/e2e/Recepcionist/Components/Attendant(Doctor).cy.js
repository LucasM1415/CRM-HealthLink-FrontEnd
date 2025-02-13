describe('Visualizar médico', () => {
    beforeEach(() => {
      cy.loginAtendente();
    });
      it('Verificando os dados do Médico', () => {
        //Seleciona o paciente no drop dawn
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(2)')
        .click({ force: true });
        cy.get('#doutores > h2').should('be.visible');
        cy.get(':nth-child(1) > :nth-child(8) > .btn').should('be.visible');
        cy.get(':nth-child(1) > :nth-child(8) > .btn').click();
        cy.wait(1000);
        cy.get('#doctorReadData > .modal-dialog > .modal-content > .modal-header > .btn-close').click({ force: true });
      });
  
  });

