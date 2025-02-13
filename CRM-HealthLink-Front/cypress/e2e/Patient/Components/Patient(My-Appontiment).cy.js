describe('Agendamento de Consulta', () => {
    beforeEach(() => {
      cy.loginPaciente(); // Garante que o paciente já está logado
      cy.visit('/pages/paciente/home/patientPage.html'); // Página inicial do paciente
    });
  
    it('Deve exibir a seção de Minhas Consultas corretamente', () => {
      // Clicar no botão "Minhas Consultas"
      cy.contains('Minhas Consultas').click();
  
      // Verificar se a seção de Minhas Consultas foi exibida
      cy.get('#appointments-list li').should('be.visible');
  
    });
  
  });
  