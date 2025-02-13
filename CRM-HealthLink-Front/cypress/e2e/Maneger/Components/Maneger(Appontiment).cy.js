describe('CRUD de Consulta', () => {
    beforeEach(() => {
      cy.loginGerente();
      cy.get('ul > :nth-child(2) > a').click();
      cy.get('#consultas > h2').should('be.visible');
    });

    it('Marcando uma Consulta inválida', () => {
        cy.get('#consultas > h2').should('be.visible');
        cy.get('#consultas > .p-3 > :nth-child(1) > .col-12 > .newUser').click();
        cy.get('#consulta-especialidade').select(0,  { force: true });
    
        // Data de consulta inválida
        cy.get('#consulta-data').type('2025-02-20').trigger('change', { force: true });
        cy.wait(1000);
        
        cy.get('#criar-consulta-medico').select(0,  { force: true });
        cy.get('#criar-consulta-paciente').select(1,  { force: true });
         // Verificar se o select de horários tem apenas um elemento
      

        cy.get('#consulta-horarios-disponiveis').select(0, { force: true });

    
        //Consulta não marcada pois não há horario do médico no dia
        cy.get('#modalCriarConsulta > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
    });
    
    it('Marcando uma Consulta valida', () => {
        cy.get('#consultas > h2').should('be.visible');
        cy.get('#consultas > .p-3 > :nth-child(1) > .col-12 > .newUser').click();
        cy.get('#consulta-especialidade').select(0,  { force: true });
        cy.get('#consulta-data').type('2025-02-15').trigger('change', { force: true });
        cy.wait(1000);
        cy.get('#criar-consulta-medico').select(0,  { force: true });
        cy.get('#criar-consulta-paciente').select(1,  { force: true });
        cy.get('#consulta-horarios-disponiveis').select(1,  { force: true });
        cy.get('#modalCriarConsulta > .modal-dialog > .modal-content > .modal-footer > .btn')
        cy.wait(1000);
        cy.get('#modalCriarConsulta > .modal-dialog > .modal-content > .modal-footer > .btn').click();
    
      });

  });