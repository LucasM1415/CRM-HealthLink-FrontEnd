describe('Funcionalidades de Horário', () => {
    beforeEach(() => {
      cy.loginGerente();
      cy.get(':nth-child(4) > a').click();
      cy.get('#prontidao > h2').should('be.visible');
    });

    it('Agendando uma prontidão', () => {
        cy.get('#prontidao > .p-3 > .row > .col-12 > .btn').click();
        cy.get('#prontidao-data').type('2025-02-20').trigger('change', { force: true })
        cy.get('#prontidao-inicio').type('08:00');
        cy.get('#prontidao-fim').type('15:00');
        cy.get('#prontidao-emails').type('doctor@email.com');
        cy.get('#newProntidaoBtn').click();
        cy.wait(1000);
      });
      it('Deletando uma prontidão', () => {
        cy.get('tr > :nth-child(4) > .btn').click();

      }); 
  });
