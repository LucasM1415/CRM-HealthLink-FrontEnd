describe('CRUD de funcionario', () => {
    beforeEach(() => {
      cy.loginAtendente();
    });
    it('Tentativa de criação de paciente inválido', () => {
        // Seleciona o paciente no dropdown
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(1)')
          .click({ force: true });
      
        // Confirmação de que está na seção de paciente
        cy.get('#pacientes > h2').should('be.visible');
      
        // Criando Paciente com erro
        cy.get('#pacientes > .p-3 > :nth-child(1) > .col-12 > .newUser > strong').click();
        cy.get('#criar-paciente-nome').type('k'); 
        cy.get('#criar-paciente-data-nascimento').type('1990-05-20');
        cy.get('#criar-paciente-cpf').type('123'); // CPF inválido
        cy.get('#criar-paciente-email').type('joaosilva.com'); // E-mail inválido
        cy.get('#criar-paciente-password').type('senha123');
      
        // Clicar no botão para criar o paciente
        cy.get('#newUserBtn').click();
      
        // Verificar se aparece uma mensagem de erro
        cy.contains('Erro ao criar paciente').should('be.visible'); // Ajustar conforme necessário
      });

      it('Criando um Paciente válido', () => {
        //Seleciona o paciente no drop dawn
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(1)')
        .click({ force: true });
        //Confirmação de está na seção de paciente
        cy.get('#pacientes > h2').should('be.visible');
        //Criando Paciente
        cy.get('#pacientes > .p-3 > :nth-child(1) > .col-12 > .newUser > strong').click();
        cy.get('#criar-paciente-nome').type('João da Silva');
        cy.get('#criar-paciente-data-nascimento').type('1990-05-20', { force: true });
        cy.get('#criar-paciente-cpf').type('14172331416');
        cy.get('#criar-paciente-email').type('joao.silva@example.com');
        cy.get('#criar-paciente-password').type('senha123');
        // Clicar no botão para criar o paciente
        cy.get('#newUserBtn').click();
    
        // Verificar se o paciente foi cadastrado corretamente (ajustar conforme necessário)
        cy.contains('Paciente criado com sucesso').should('be.visible');
        cy.wait(1000);
        cy.get('#userForm > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
    
      });
      
      it('Verificando os dados do paciene', () => {
        //Seleciona o paciente no drop dawn
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(1)')
        .click({ force: true });
        //Confirmação de está na seção de paciente
        cy.get('#pacientes > h2').should('be.visible');
        cy.get(':nth-child(2) > :nth-child(6) > .btn-success > .bi').should('be.visible');
        cy.get(':nth-child(2) > :nth-child(6) > .btn-success > .bi').click();
        cy.wait(1000);
        cy.get('#readData > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
      });
    
      
      it('Excluindo paciente', () => {
        //Seleciona o paciente no drop dawn
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(1)')
        .click({ force: true });
        //Confirmação de está na seção de paciente
        cy.get('#pacientes > h2').should('be.visible');
        cy.get(':nth-child(2) > :nth-child(6) > .btn-danger').should('be.visible');
        cy.get(':nth-child(2) > :nth-child(6) > .btn-danger').click();
        cy.get('#pacientes > #deleteModal > .modal-content > #confirmDelete').click();
        
    
      });

  });

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

  describe('CRUD de Consulta', () => {
    beforeEach(() => {
      cy.loginAtendente();
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
        cy.get('#consulta-horarios-disponiveis option').should('have.length', 1);

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
        cy.get('#modalCriarConsulta > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
    
      });

  });
