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

describe('Visualisar consultas marcadas', () => {
    beforeEach(() => {
      cy.loginMedico();
    });

    it('Marcando uma Consulta', () => {
      // Confirmação de que está na seção de paciente
      cy.get('#Calendario > h2').should('be.visible');
      cy.get('body > header > div.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(2)').click({ force: true });
      cy.get('#appointments > h2').should('be.visible');

 
    });
    
   

  });

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