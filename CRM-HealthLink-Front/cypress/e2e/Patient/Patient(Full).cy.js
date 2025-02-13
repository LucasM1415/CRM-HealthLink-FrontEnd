describe('Testes de Paciente', () => {
    beforeEach(() => {
      cy.loginPaciente(); // Garante que o paciente já está logado
      cy.visit('/pages/paciente/home/patientPage.html'); // Página inicial do paciente
    });
  
    it('Deve exibir "Nada encontrado" quando não houver médicos disponíveis', () => {
      // Navegar até a seção de Agendamento de Consulta
      cy.contains('Agendar Consulta').click();
      cy.get('#agendarConsulta').should('be.visible');
  
      // Selecionar uma especialidade onde não há médicos disponíveis
      cy.get('#especialidadeSelect').select(1); // Ajuste conforme necessário
  
      // Escolher uma data onde não há médicos disponíveis
      cy.get('#dataSelect').type('2030-12-31'); // Data fictícia sem médicos
  
      // Clicar no botão de buscar disponibilidade
      cy.get('#submit-button').click();
  
      // Verificar se foi redirecionado para a página correta
      cy.url().should('include', '/marcarConsulta.html'); 
  
      // Verificar se a mensagem de "Nada encontrado" aparece
      cy.contains('Nada encontrado').should('be.visible');
    });
  
    it('Deve permitir que o paciente marque uma consulta com sucesso', () => {
      // Navegar até a seção de Agendamento de Consulta
      cy.contains('Agendar Consulta').click();
      cy.get('#agendarConsulta').should('be.visible');
  
      // Selecionar a especialidade "CLINICOGERAL"
      cy.get('#especialidadeSelect').select('CLINICOGERAL');
  
      // Selecionar a data "14/02/2025"
      cy.get('#dataSelect').type('2025-02-15');
  
      // Clicar no botão de buscar disponibilidade
      cy.get('#submit-button').click();
  
      // Verificar se pelo menos um horário está disponível
      cy.get('.cardMedicoDisponibilidade span')
        .should('exist')
        .first()
        .click(); // Seleciona o primeiro horário disponível
  
      // Confirmar que a mensagem de sucesso foi exibida
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Consulta marcada com sucesso!');
      });
    });

    
    it('Deve exibir a seção de Minhas Consultas corretamente', () => {
        // Clicar no botão "Minhas Consultas"
        cy.contains('Minhas Consultas').click();
    
        // Verificar se a seção de Minhas Consultas foi exibida
        cy.get('#appointments-list li').should('be.visible');
    
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
  