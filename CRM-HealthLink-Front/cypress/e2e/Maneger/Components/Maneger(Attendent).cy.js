describe('CRUD de Funcionario', () => {
    beforeEach(() => {
      cy.loginGerente(); // Garante que o gerente está logado
    });


    it('Criando um Funcionario invalido', () => {
    
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(3)')
        .click({ force: true });
        
        cy.get('#funcionarios> h2').should('be.visible');
       
        cy.get('#funcionarios > .p-3 > :nth-child(1) > .col-12 > .newUser > strong').click();
        cy.get('#criar-funcionario-nome').type('João da Silva');
        cy.get('#criar-funcionario-data-nascimento').type('1990-05-20', { force: true });
        cy.get('#criar-funcionario-cargo').select(1,  { force: true });

        cy.get('#criar-funcionario-cpf').type('124137294880');
        cy.get('#criar-funcionario-email').type('joao.silva3@example.com');
        cy.get('#criar-funcionario-password').type('senha123');
     
        cy.get('#newUserBtnFuncionario').click();
    
        
        cy.contains('Erro ao criar funcionário').should('be.visible');
        cy.wait(1000);
        cy.get('#employeeForm > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
    
      });

    it('Criando um Funcionario válido', () => {
        //Seleciona o paciente no drop dawn
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(3)')
        .click({ force: true });
        //Confirmação de está na seção de paciente
        cy.get('#funcionarios> h2').should('be.visible');
       
        cy.get('#funcionarios > .p-3 > :nth-child(1) > .col-12 > .newUser > strong').click();
        cy.get('#criar-funcionario-nome').type('João da Silva');
        cy.get('#criar-funcionario-data-nascimento').type('1990-05-20', { force: true });
        cy.get('#criar-funcionario-cargo').select(1,  { force: true });

        cy.get('#criar-funcionario-cpf').type('12413729429');
        cy.get('#criar-funcionario-email').type('joao.silva3@example.com');
        cy.get('#criar-funcionario-password').type('senha123');
        
        cy.get('#newUserBtnFuncionario').click();
    
       
        cy.contains('Funcionário criado com sucesso').should('be.visible');
        cy.wait(1000);
        cy.get('#employeeForm > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
  
      });

      it('Editando um funcionário (Falho)', () => {
       
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(3)')
        .click({ force: true });
      
        cy.get('#funcionarios > h2').should('be.visible');
    
        cy.get(':nth-child(3) > :nth-child(6) > .btn-primary').click();
        //CPF Invalido
        cy.get('#update-funcionario-cpf').type('12413729488');
        cy.get('#update-funcionario-nome').clear({ force: true }).type('TESTE DE ALTERAÇÃO', { force: true });
        cy.get('#update-funcionario-data-nascimento').clear({ force: true }).type('2025-01-01', { force: true });
        cy.get('#update-funcionario-cargo').select(0,  { force: true })
        cy.get('#update-funcionario-password').clear({ force: true }).type('senha123', { force: true });
    
        cy.get('#updateUserBtnFuncionario').click();
    
        // Verificar se o paciente foi cadastrado corretamente (ajustar conforme necessário)
        cy.contains('Erro ao atualizar funcionário').should('be.visible');
        cy.wait(1000);
        cy.get('#employeeUpdateForm > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
    
      });

      it('Editando um funcionário (Sucesso)', () => {
        //Seleciona o paciente no drop dawn
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(3)')
        .click({ force: true });
        //Confirmação de está na seção de paciente
        cy.get('#funcionarios > h2').should('be.visible');
    
        cy.get(':nth-child(3) > :nth-child(6) > .btn-primary').click();
        //CPF Invalido
        cy.get('#update-funcionario-cpf').type('12413729429');
        cy.get('#update-funcionario-nome').clear({ force: true }).type('TESTE DE ALTERAÇÃO', { force: true });
        cy.get('#update-funcionario-data-nascimento').clear({ force: true }).type('2025-01-01', { force: true });
        cy.get('#update-funcionario-cargo').select(0,  { force: true })
        cy.get('#update-funcionario-password').clear({ force: true }).type('senha123', { force: true });
    
        cy.get('#updateUserBtnFuncionario').click();
    
        // Verificar se o paciente foi cadastrado corretamente (ajustar conforme necessário)
        cy.contains('Funcionário atualizado com sucesso').should('be.visible');
        cy.wait(1000);
        cy.get('#employeeUpdateForm > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
    
      });

      it('Verificando os dados do Funcionário', () => {
        //Seleciona o paciente no drop dawn
        cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(3)')
        .click({ force: true });
        cy.get('#funcionarios > h2').should('be.visible');
        cy.get(':nth-child(3) > :nth-child(6) > .btn-success').should('be.visible');
        cy.get(':nth-child(3) > :nth-child(6) > .btn-success').click();
        cy.wait(1000);
        cy.get(':nth-child(3) > :nth-child(6) > .btn-primary').click({ force: true });
      });
  

   //151.358.220-89
   //
   
  
  });