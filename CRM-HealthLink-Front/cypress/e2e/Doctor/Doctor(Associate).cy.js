describe('CRUD de Consulta', () => {
    beforeEach(() => {
      cy.loginMedico();
    });

    it('Marcando uma Consulta', () => {
      // Confirmação de que está na seção de paciente
      cy.get('#Calendario > h2').should('be.visible');
      cy.get('body > header > div.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(1)').click({ force: true });

      cy.wait(1000);
      cy.get('#selectAgendamentos').select(0,  { force: true }).trigger('change', { force: true });
      cy.wait(1000);
      cy.get('#specialty').select(0,  { force: true }).trigger('change', { force: true });
      cy.wait(1000);
      cy.get('#month').select(1,  { force: true });
      cy.get('#year').clear({ force: true }).type('2025', { force: true });
      cy.get('.button').click().trigger('change', { force: true });
      cy.get(':nth-child(27) > p').click();
      cy.get('#selected-day-info > :nth-child(2) > .button').click();
       
    });
    
   

  });