describe('CRUD de Paciente', () => {
  beforeEach(() => {
    cy.loginGerente(); // Garante que o gerente está logado
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

  
  it('Editando os dados do paciente (Falho)', () => {
    //Seleciona o paciente no drop dawn
    cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(1)')
    .click({ force: true });
    //Confirmação de está na seção de paciente
    cy.get('#pacientes > h2').should('be.visible');
    cy.get(':nth-child(2) > :nth-child(6) > .btn-primary > .bi').should('be.visible');
    cy.get(':nth-child(2) > :nth-child(6) > .btn-primary > .bi').click();
    //CPF invalido
    cy.get('#update-patient-cpf').type('141723');
    cy.get('#update-patient-name').clear({ force: true }).type('TESTE DE ALTERAÇÃO', { force: true });
    cy.get('#update-patient-birthdate').clear({ force: true }).type('2025-01-01', { force: true });
    cy.get('#update-patient-password').clear({ force: true }).type('senha123', { force: true });

    //Clicar no botão de atualizar
    cy.get('#updateUserBtn').click();

    cy.contains('Erro ao atualizar paciente').should('be.visible');
    cy.wait(1000);
    cy.get('#updateUserForm > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
    
  });

  it('Editando os dados do paciente (Sucesso)', () => {
    //Seleciona o paciente no drop dawn
    cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(1)')
    .click({ force: true });
    //Confirmação de está na seção de paciente
    cy.get('#pacientes > h2').should('be.visible');
    cy.get(':nth-child(2) > :nth-child(6) > .btn-primary > .bi').should('be.visible');
    cy.get(':nth-child(2) > :nth-child(6) > .btn-primary > .bi').click();
    cy.get('#update-patient-cpf').type('14172331416');
    cy.get('#update-patient-name').clear({ force: true }).type('TESTE DE ALTERAÇÃO', { force: true });
    cy.get('#update-patient-birthdate').clear({ force: true }).type('2025-01-01', { force: true });
    cy.get('#update-patient-password').clear({ force: true }).type('senha123', { force: true });

    //Clicar no botão de atualizar
    cy.get('#updateUserBtn').click();

    cy.contains('Paciente atualizado com sucesso').should('be.visible');
    cy.wait(1000);
    cy.get('#updateUserForm > .modal-dialog > .modal-content > .modal-header > .btn-close').click();
    
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
describe('CRUD de Medico', () => {
  beforeEach(() => {
    cy.loginGerente(); // Garante que o gerente está logado
  });

  it('Editando um medico (Falho)', () => {
    
    cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(2)')
    .click({ force: true });
    //Confirmação de está na seção de médico
    cy.get('#doutores > h2').should('be.visible');
    //Editando médico
    cy.get(':nth-child(2) > :nth-child(8) > .btn-primary').click();
    //CPF Invalido
    cy.get('#update-doutor-cpf').type('61363766440');
    cy.get('#update-doutor-crm').clear({ force: true }).type('54321-TS', { force: true });
    cy.get('#update-doutor-nome').clear({ force: true }).type('TESTE DE ALTERAÇÃO', { force: true });
    cy.get('#update-doutor-data-nascimento').clear({ force: true }).type('2025-01-01', { force: true });
    cy.get('#update-doutor-password').clear({ force: true }).type('senha123', { force: true });

    // Clicar no botão para atualizar o Médico
    cy.get('#updateDoctorBtn').click();

    // Verificar se o médico foi alterado corretamente
    cy.contains('Erro ao atualizar médico').should('be.visible');
    cy.wait(1000);
    cy.get('#doctorUpdateForm > .modal-dialog > .modal-content > .modal-header > .btn-close').click();

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

  it('Editando um medico (Sucesso)', () => {
   
    cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(2)')
    .click({ force: true });
 
    cy.get('#doutores > h2').should('be.visible');
   
    cy.get(':nth-child(2) > :nth-child(8) > .btn-primary').click();
    cy.get('#update-doutor-cpf').type('83483608400');
    cy.get('#update-doutor-crm').clear({ force: true }).type('12345-TS', { force: true });
    cy.get('#update-doutor-nome').clear({ force: true }).type('TESTE DE ALTERAÇÃO', { force: true });
    cy.get('#update-doutor-data-nascimento').clear({ force: true }).type('2025-01-01', { force: true });
    cy.get('#update-doutor-password').clear({ force: true }).type('senha123', { force: true });

    // Clicar no botão para atualizar o Médico
    cy.get('#updateDoctorBtn').click();

  
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
      //Seleciona o paciente no drop dawn
      cy.get('body > header > section.bottom-header > div > nav > ul > li.menu-drop > div > a:nth-child(3)')
      .click({ force: true });
      //Confirmação de está na seção de paciente
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

});
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
describe('Funcionalidades de Prontidão', () => {
  beforeEach(() => {
    cy.loginGerente();
    cy.get(':nth-child(4) > a').click();
    cy.get('#prontidao > h2').should('be.visible');
  });

  it('Agendando uma prontidão', () => {
      cy.get('#prontidao > .p-3 > .row > .col-12 > .btn').click();
      cy.get('#prontidao-data').type('2025-02-20').trigger('change', { force: true })
      cy.get('#prontidao-inicio').type('08:00');
      cy.get('#prontidao-fim').type('15:00');
      cy.get('#prontidao-emails').type('doctor@email.com');
      cy.get('#newProntidaoBtn').click();
      cy.wait(1000);
    });
    it('Deletando uma prontidão', () => {
      cy.get('tr > :nth-child(4) > .btn').click();

    }); 
});
