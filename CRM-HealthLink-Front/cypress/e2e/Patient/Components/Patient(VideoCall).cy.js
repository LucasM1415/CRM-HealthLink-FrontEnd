describe('Agendamento de Consulta', () => {
    beforeEach(() => {
      cy.loginPaciente(); // Garante que o paciente já está logado
      cy.visit('/pages/paciente/home/patientPage.html'); // Página inicial do paciente
    });
  

    it('Deve verificar se os botões de câmera e microfone estão presentes após entrar na chamada', () => {
        // Clicar no botão "Prontidão"
        cy.contains('Prontidão').click();
    
        // Verificar se a seção correta foi exibida
        cy.get('#prontidao').should('be.visible');
    
        // Clicar no botão "Entrar"
        cy.get('.paciente-atendimento-remoto-container a').click();
    
        // Verificar se a URL mudou corretamente
        cy.url().should('include', '/chamada/paciente/chamadaPacienteProntidao.html');
    
        // Verificar se os botões de câmera e microfone estão visíveis
        cy.get('#micButton').should('be.visible');
        cy.get('#camButton').should('be.visible');
        cy.wait(1000)

        cy.get('.back-button').click({ force: true })
    });
    
  
  });
  