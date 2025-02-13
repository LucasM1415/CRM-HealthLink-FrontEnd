describe('Funcionalidades de Horário', () => {
    beforeEach(() => {
      cy.loginGerente();
      cy.get('ul > :nth-child(3) > a').click();
      cy.get('#horario > h2').should('be.visible');
    });

    it('Marcando um Horário', () => {
        cy.get('#selectSpeciality').select(0,  { force: true }).trigger('change', { force: true });
        cy.wait(1000);
        cy.get('#selectAgendamentos').select(0,  { force: true });;
        cy.wait(1000);
        cy.get('#month').select(1,  { force: true });
        cy.get('#year').select(25,  { force: true });
        cy.get('.date-selectors > button').click();
        cy.get(':nth-child(20) > p').click();
        cy.get('#Hora-de-inicio').type('08:00');
        cy.get('#Hora-de-termino').type('16:00');
        cy.get('#quantidade-De-Vagas').type('3');
        cy.get('#selected-day-info > button').click();
      });

      it('Vendo o histórico de horarios', () => {
        cy.get('.listadehorarios > a > button').click();
        cy.url().should('include', '/listSchedulesManagerPage.html');
        cy.get('#horario > :nth-child(1) > :nth-child(2)').click();
        cy.get('#horario > :nth-child(1) > :nth-child(3)').click();
        cy.get('#horario > :nth-child(1) > :nth-child(2)').click();
        cy.wait(2000);

      });

      it('Pesquisando horário', () => {
        cy.get('.listadehorarios > a > button').click();
        cy.url().should('include', '/listSchedulesManagerPage.html');
        cy.get('#horario > :nth-child(1) > :nth-child(3)').click();
        cy.get('#specialization-search').select(0,  { force: true }).trigger('change', { force: true });
        cy.get('#month-search').type('2').trigger('change', { force: true });
        cy.get('#year-search').type('2025').trigger('change', { force: true });
        cy.get('#search-button').click().trigger('change', { force: true });
        cy.get('#search-results > h3').should('be.visible');
        
      });

  });
