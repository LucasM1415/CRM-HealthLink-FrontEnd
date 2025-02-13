
  describe('Visualisar consultas marcadas', () => {
    beforeEach(() => {
      cy.loginMedico();
    });

    it('Marcando uma Consulta', () => {
      cy.get('#Calendario > h2').should('be.visible');
      cy.get('body > header > div.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(2)').click({ force: true });
      cy.get('#appointments > h2').should('be.visible');

 
    });
    
  });