describe('CRUD de Medico', () => {
    beforeEach(() => {
      cy.loginGerente(); // Garante que o gerente está logado
    });

    it('Criando um Médico Invalido', () => {
        //Seleciona o paciente no drop dawn
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(2)')
        .click({ force: true });
        //Confirmação de está na seção de paciente
        cy.get('#doutores > h2').should('be.visible');
        //Criando Paciente
        cy.get('#doutores > .p-3 > :nth-child(1) > .col-12 > .newUser > strong').click();
        cy.get('#criar-doutor-nome').type('Dr.João da Silva');
        cy.get('#criar-doutor-data-nascimento').type('1990-05-20', { force: true });
        //CPF invalido
        cy.get('#criar-doutor-cpf').type('83483608');
        //CRM invalido
        cy.get('#criar-doutor-crm').type('12345');
        cy.get('#criar-doutor-email').type('joao.silva@example.com');
        cy.get('#criar-doutor-password').type('senha123');
        // Clicar no botão para criar o paciente
        cy.get('#newDoctorBtn').click();
    
        // Verificar se o paciente foi cadastrado corretamente (ajustar conforme necessário)
        cy.contains('Erro ao criar médico').should('be.visible');
        cy.wait(1000);
        cy.get('#doctorForm > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
      });
    

    it('Criando um Médico válido', () => {
      //Seleciona o paciente no drop dawn
      cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(2)')
      .click({ force: true });
      //Confirmação de está na seção de paciente
      cy.get('#doutores > h2').should('be.visible');
      //Criando Paciente
      cy.get('#doutores > .p-3 > :nth-child(1) > .col-12 > .newUser > strong').click();
      cy.get('#criar-doutor-nome').type('Dr.João da Silva');
      cy.get('#criar-doutor-data-nascimento').type('1990-05-20', { force: true });
      cy.get('#criar-doutor-cpf').type('83483608400');
      cy.get('#criar-doutor-crm').type('12346-PE');
      cy.get('#criar-doutor-email').type('joao.silva2@example.com');
      cy.get('#criar-doutor-password').type('senha123');
      // Clicar no botão para criar o Médico
      cy.get('#newDoctorBtn').click();
  
      // Verificar se o paciente foi cadastrado corretamente (ajustar conforme necessário)
      cy.contains('Médico criado com sucesso').should('be.visible');
      cy.wait(1000);
      cy.get('#doctorForm > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
  
    });

    it('Editando um medico (Falho)', () => {
        //Seleciona o paciente no drop dawn
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(2)')
        .click({ force: true });
        //Confirmação de está na seção de paciente
        cy.get('#doutores > h2').should('be.visible');
        //Criando Paciente
        cy.get(':nth-child(2) > :nth-child(8) > .btn-primary').click();
        //CPF Invalido
        cy.get('#update-doutor-cpf').type('83483608401');
        cy.get('#update-doutor-crm').clear({ force: true }).type('54321-TS', { force: true });
        cy.get('#update-doutor-nome').clear({ force: true }).type('TESTE DE ALTERAÇÃO', { force: true });
        cy.get('#update-doutor-data-nascimento').clear({ force: true }).type('2025-01-01', { force: true });
        cy.get('#update-doutor-password').clear({ force: true }).type('senha123', { force: true });
    
        // Clicar no botão para atualizar o Médico
        cy.get('#updateDoctorBtn').click();
    
        // Verificar se o paciente foi cadastrado corretamente (ajustar conforme necessário)
        cy.contains('Erro ao atualizar médico').should('be.visible');
        cy.wait(1000);
        cy.get('#doctorUpdateForm > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
    
      });

    
    it('Editando um medico (Sucesso)', () => {
        //Seleciona o paciente no drop dawn
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(2)')
        .click({ force: true });
        //Confirmação de está na seção de paciente
        cy.get('#doutores > h2').should('be.visible');
        //Criando Paciente
        cy.get(':nth-child(2) > :nth-child(8) > .btn-primary').click();
        cy.get('#update-doutor-cpf').type('83483608400');
        cy.get('#update-doutor-crm').clear({ force: true }).type('54321-TS', { force: true });
        cy.get('#update-doutor-nome').clear({ force: true }).type('TESTE DE ALTERAÇÃO', { force: true });
        cy.get('#update-doutor-data-nascimento').clear({ force: true }).type('2025-01-01', { force: true });
        cy.get('#update-doutor-password').clear({ force: true }).type('senha123', { force: true });
    
        // Clicar no botão para atualizar o Médico
        cy.get('#updateDoctorBtn').click();
    
        // Verificar se o paciente foi cadastrado corretamente (ajustar conforme necessário)
        cy.contains('Médico atualizado com sucesso').should('be.visible');
        cy.wait(1000);
        cy.get('#doctorUpdateForm > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
    
      });

      it('Verificando os dados do Médico', () => {
        //Seleciona o paciente no drop dawn
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(2)')
        .click({ force: true });
        cy.get('#doutores > h2').should('be.visible');
        cy.get(':nth-child(2) > :nth-child(8) > .btn-primary').should('be.visible');
        cy.get(':nth-child(2) > :nth-child(8) > .btn-primary').click();
        cy.wait(1000);
        cy.get(':nth-child(2) > :nth-child(8) > .btn-primary').click({ force: true });
      });
  
   
  
  });