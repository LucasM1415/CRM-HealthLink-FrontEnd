//const ip = 'localhost';

// Criar um Médico
async function criarMedico(token, data) {
    if (!token) {
        alert('Usuário não autenticado.');
        return;
    }

    const url = `http://${ip}:8080/crmhealthlink/api/employee/doctor/${managerId}`;
     
    const requestBody = {
        name: data['criar-doctor-nome'],
        birthDate: data['criar-doctor-dataNascimento'],
        cpf: data['criar-doctor-cpf'],
        email: data['criar-doctor-email'],
        crm: data['criar-doctor-crm'],
        specialization: data['criar-doctor-especializacao'],
        accessLevel: 'DOCTOR'
    };

    try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
    
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
    
        const responseData = await response.json();
        alert('Médico criado com sucesso!');
        handleCreationResult('success');
      } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao criar médico.');
        handleCreationResult('error');
      }
}

//Funcção pra lidar com a criar do Médico
async function handleCreationResult(status) {
  const resultsDivs = document.getElementById('results');

  switch (status) {
    case 'success':
      resultsDivs.innerText = 'Médico criado com sucesso!';
      break;

    case 'error':
      const token = localStorage.getItem('token');
      if (token) {
        await listarPacientes(token);
        await preencherSelectPacientes();
      }
      break;

    default:
      resultsDivs.innerText = 'Status desconhecido.';
      break;
  }
}

async function  setupDoctorForm() {
  const form = document.getElementById('criar-doutor-form');

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const token = localStorage.getItem('token');
      const data = {
        'criar-doutor-nome' : document.getElementById('criar-doutor-nome').value,
        'criar-doutor-data-nascimento' : document.getElementById('criar-doutor-data-nascimento').value,
        'criar-doutor-cpf' : document.getElementById('criar-doutor-cpf').value,
        'criar-doutor-email' : document.getElementById('criar-doutor-email').value
      };

      await criarMedico(token, data);
    })
  }

  
}

//Atualizar um Médico pelo ID
async function atualizarMedico(token, medicoId, data) {
    if (!token) {
      alert('Usuário não autenticado.');
      return;
    }
  
    const url = `http://${ip}:8080/crmhealthlink/api/manager/update/doctor/${medicoId}`;
  
    const requestBody = {
      name: data['nome'],
      birthDate: data['dataNascimento'],
      cpf: data['cpf'],
      email: data['email'],
      accessLevel: 'DOCTOR',
      crm: data['crm'],
      specialization: data['especializacao']
    };
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
  
      alert('Médico atualizado com sucesso!');
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao atualizar médico.');
    }
  }

//Criar um Funcionário
async function criarFuncionario(token, data) {
    if (!token) {
      alert('Usuário não autenticado.');
      return;
    }
  
    const url = `http://${ip}:8080/crmhealthlink/api/manager/create/employee`;
  
    const requestBody = {
      name: data['nome'],
      birthDate: data['dataNascimento'],
      cpf: data['cpf'],
      email: data['email'],
      accessLevel: data['nivelAcesso']
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
  
      alert('Funcionário criado com sucesso!');
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao criar funcionário.');
    }
  }
  
//Obter um Funcionário
async function obterFuncionario(token, funcionarioId) {
    if (!token) {
      alert('Usuário não autenticado.');
      return;
    }
  
    const url = `http://${ip}:8080/crmhealthlink/api/manager/get/employee/${funcionarioId}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
  
      const data = await response.json();
      // Renderize os detalhes do funcionário conforme necessário
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao obter funcionário.');
    }
  }
  

//Atualizar um Funcionário
async function atualizarFuncionario(token, funcionarioId, data) {
    if (!token) {
      alert('Usuário não autenticado.');
      return;
    }
  
    const url = `http://${ip}:8080/crmhealthlink/api/manager/update/employee/${funcionarioId}`;
  
    const requestBody = {
      name: data['nome'],
      birthDate: data['dataNascimento'],
      cpf: data['cpf'],
      email: data['email'],
      accessLevel: data['nivelAcesso']
    };
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
  
      alert('Funcionário atualizado com sucesso!');
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao atualizar funcionário.');
    }
  }

  function renderPacientes(data) {
    const resultsTable = document.querySelector('table tbody');
  
    if (!resultsTable) {
      console.error('Elemento com ID "table tbody" não encontrado.');
      return;
    }
  
    resultsTable.innerHTML = '';
  
    if (!Array.isArray(data)) {
      console.error('Os dados fornecidos não são uma lista de pacientes.');
      return;
    }
  
    data.forEach(paciente => {
      const row = document.createElement('tr');
  
      row.innerHTML = `
        <td>${paciente.id || 'ID não disponível'}</td>
        <td>${paciente.name || 'Nome não disponível'}</td>
        <td>${paciente.birthDate ? new Date(paciente.birthDate).toLocaleDateString() : 'Data de Nascimento não disponível'}</td>
        <td>${paciente.email || 'Email não disponível'}</td>
      `;
  
      resultsTable.appendChild(row);
    });
  }

  function renderPaciente(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; 
  
    if (data) {
      resultsDiv.innerHTML = `
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Data de nascimento:</strong> ${data.birthDate}</p>
        <p><strong>Email:</strong> ${data.email}</p>
      `;
    } else {
      resultsDiv.innerText = 'Nenhum paciente encontrado.';
    }
  }

  async function setupPacienteForm() {
    const form = document.getElementById('criar-paciente-form');
  
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); 
  
            const token = localStorage.getItem('token');
            const data = {
                'criar-paciente-nome': document.getElementById('criar-paciente-nome').value,
                'criar-paciente-data-nascimento': document.getElementById('criar-paciente-data-nascimento').value,
                'criar-paciente-cpf': document.getElementById('criar-paciente-cpf').value,
                'criar-paciente-email': document.getElementById('criar-paciente-email').value,
                'criar-paciente-password': document.getElementById('criar-paciente-password').value
            };
  
            await criarPaciente(token, data);
        });
    }
  }
//Listar pacientes
  async function listarPacientes(token) {
    if (!token) {
      alert('Usuário não autenticado.');
      return;
    }
  
    const url = `http://${ip}:8080/crmhealthlink/api/employee/pacientes`; 
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
  
      const data = await response.json();
      renderPacientes(data);



    } catch (error) {
      console.error('Erro na requisição:', error);
      const resultsTable = document.querySelector('table tbody');
      resultsTable.innerHTML = '<tr><td colspan="5">Erro ao listar pacientes.</td></tr>';
    }
  }

  async function setupRemovalEventListeners() {
    const form = document.getElementById('remover-paciente-form');
  
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita o envio padrão do formulário
  
            const pacienteId = document.getElementById('remover-paciente-id').value.trim(); // Obtém o ID do paciente
            const token = localStorage.getItem('token'); // Obtém o token do armazenamento local
  
            if (pacienteId === '') {
                document.getElementById('results').innerText = 'Por favor, insira o ID do paciente.';
                return;
            }
  
            await removerPaciente(token, pacienteId);
        });
    }
  }
//Preencher select de especialidade
async function preencherSelectEspecialidades(selectId) {
  const token = localStorage.getItem('token');
  if (!token) {
      console.error('Token não encontrado no localStorage');
      return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/employee/doctors`;

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
      }

      const medicos = await response.json();
      const especialidades = extrairEspecialidadesUnicas(medicos);
      renderEspecialidadesSelect(especialidades, selectId);
  } catch (error) {
      console.error('Erro ao preencher o select com especialidades:', error);
  }
}

function extrairEspecialidadesUnicas(medicos) {
  // Extrai as especialidades e remove duplicatas
  const especialidades = medicos.map(medico => medico.specialty);
  const especialidadesUnicas = [...new Set(especialidades)]; // Remove duplicatas
  return especialidadesUnicas;
}

function renderEspecialidadesSelect(especialidades, selectId) {
  const selectElement = document.getElementById(selectId);
  
  if (!selectElement) {
      console.error('Elemento <select> não encontrado!');
      return;
  }

  selectElement.innerHTML = '';

  const optionDefault = document.createElement('option');
  optionDefault.value = '';
  optionDefault.textContent = 'Selecione uma especialidade';
  selectElement.appendChild(optionDefault);

  especialidades.forEach(especialidade => {
      const option = document.createElement('option');
      option.value = especialidade; // O valor da especialidade em si
      option.textContent = especialidade || 'Nome não disponível';
      selectElement.appendChild(option);
  });
}


//Criar um horário
async function criarHorarios() {
  const token = localStorage.getItem('token');
  if (!token) {
      console.error('Token não encontrado no localStorage');
      return;
  }

  const date = document.getElementById('calendar').value;
  const specialization = document.getElementById('specialization').value.toUpperCase();

  // Coletar os turnos selecionados
  const turnosSelecionados = Array.from(document.querySelectorAll('input[name="turnos"]:checked'));

  const url = `http://${ip}:8080/crmhealthlink/api/calendario`;

  for (const turno of turnosSelecionados) {
      const [startHour, startMinute] = turno.dataset.horarioInicio.split(':').map(Number);
      const [endHour, endMinute] = turno.dataset.horarioFim.split(':').map(Number);
      
      // Formatar horas e minutos para sempre ter 2 dígitos
      const formattedStartHour = String(startHour).padStart(2, '0');
      const formattedStartMinute = String(startMinute).padStart(2, '0');
      const formattedEndHour = String(endHour).padStart(2, '0');
      const formattedEndMinute = String(endMinute).padStart(2, '0');
      
      const horario = {
          date,
          homeTime: `${formattedStartHour}:${formattedStartMinute}:00`, // Formato "HH:mm:ss"
          endTime: `${formattedEndHour}:${formattedEndMinute}:00`,     // Formato "HH:mm:ss"
          specialtyType: specialization
      };

      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              },
              body: JSON.stringify(horario)
          });

          if (!response.ok) {
              throw new Error(`Erro HTTP! Status: ${response.status}`);
          }

          const result = await response.json();
          console.log('Horário criado com sucesso:', result);
      } catch (error) {
          console.error('Erro ao criar o horário:', error);
      }
  }
}





//Listar horários
async function listarHorarios() {
  const token = localStorage.getItem('token');
  if (!token) {
      console.error('Usuário não autenticado.');
      return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/calendario`; // Ajuste a URL conforme necessário

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
      }

      const data = await response.json();
      renderizarHorarios(data);
  } catch (error) {
      console.error('Erro na requisição:', error);
      const resultsTable = document.getElementById('list-horarios-tbody');
      resultsTable.innerHTML = '<tr><td colspan="4">Erro ao listar horários.</td></tr>';
  }
}

function renderizarHorarios(data) {
  const resultsTable = document.getElementById('list-horarios-tbody');

  if (!resultsTable) {
      console.error('Elemento da tabela não encontrado.');
      return;
  }

  resultsTable.innerHTML = '';

  if (!Array.isArray(data)) {
      console.error('Os dados fornecidos não são uma lista de horários.');
      return;
  }

  data.forEach(horario => {
      const row = document.createElement('tr');

      row.innerHTML = `
          <td>${horario.date || 'Data não disponível'}</td>
          <td>${horario.homeTime || 'Hora de início não disponível'}</td>
          <td>${horario.endTime || 'Hora de término não disponível'}</td>
          <td>${horario.specialtyType || 'Especialidade não disponível'}</td>
      `;

      resultsTable.appendChild(row);
  });
}

//Listar resultado da pesquisa
async function pesquisarHorarios() {
  const token = localStorage.getItem('token');
  const specialty = document.getElementById('specialization-search').value;
  const month = document.getElementById('month-search').value;
  const year = document.getElementById('year-search').value;

  if (!token || !specialty || !month || !year) {
      console.error('Dados insuficientes para realizar a pesquisa');
      return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/calendario/specialty?specialty=${specialty}&month=${month}&year=${year}`;

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data); // Verifica a estrutura dos dados

      renderizarHorariosPesquisa(data); // Chama a função para renderizar os horários de pesquisa

      // Exibir a tabela após a pesquisa
      document.getElementById('tabela-horarios').style.display = 'block';

  } catch (error) {
      console.error('Erro ao pesquisar horários:', error);
  }
}



function renderizarHorariosPesquisa(data) {
  const resultsTable = document.getElementById('list-consultas-tbody');

  if (!resultsTable) {
      console.error('Elemento de tabela não encontrado.');
      return;
  }

  resultsTable.innerHTML = ''; // Limpa a tabela antes de adicionar novos resultados

  if (!Array.isArray(data)) {
      console.error('Os dados fornecidos não são uma lista de horários.');
      return;
  }

  data.forEach(horario => {
      const row = document.createElement('tr');

      row.innerHTML = `
          <td>${horario.id || 'ID não disponível'}</td>
          <td>${horario.paciente || 'Paciente não disponível'}</td> <!-- Ajuste conforme necessário -->
          <td>${horario.medico || 'Médico não disponível'}</td> <!-- Ajuste conforme necessário -->
          <td>${horario.date ? new Date(horario.date).toLocaleDateString() : 'Data não disponível'}</td>
          <td>${horario.homeTime || 'Horário de Início não disponível'}</td>
          <td>${horario.endTime || 'Horário de Fim não disponível'}</td>
          <td>${horario.specialtyType || 'Especialidade não disponível'}</td>
      `;

      resultsTable.appendChild(row);
  });
}




  function getToken() {
    var token = localStorage.getItem('token');
    var userid = localStorage.getItem('id');
    if (token == null) {
      window.location.href = '../index.html';
    } else {
    
      listarPacientes(token, userid)
    }
  }
  
  function singOut() {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
      alert("Você foi desconectado com sucesso.");
      window.location.href = "../pages/login.html";
    } else {
      console.error("Local storage não está disponível.");
    }
  }

function updateUserName() {
    const userName = localStorage.getItem('userName');
    const welcomeMessage = document.getElementById('welcome-message');
    if (userName) {
      welcomeMessage.textContent = `Bem-vindo(a), ${userName}`;
    } else {
      welcomeMessage.textContent = 'Bem-vindo(a), Usuário';
    }
  }
  
  async function setupEventListeners2() {
    await setupRemovalEventListeners();

    // Configuração do formulário de horário
    const horarioForm = document.getElementById('configurar-horario-form');
    const salvarButton = document.getElementById('salvar-horario-button');

    if (horarioForm && salvarButton) {
        salvarButton.addEventListener('click', async (event) => {
            event.preventDefault();
            console.log('Salvar horário clicado'); // Para verificar
            await criarHorarios(); // Chamando a função
        });
    } else {
        console.error('Formulário ou botão não encontrado');
    }

    // Opções de visualização
    const visualizacaoOptions = document.querySelectorAll('input[name="visualizacao"]');
    const searchSection = document.getElementById('search-section');
    const listaHorarios = document.getElementById('lista-horarios');

    // Verifica a opção de visualização selecionada
    const selectedOption = document.querySelector('input[name="visualizacao"]:checked');
    if (selectedOption && selectedOption.value === 'todos') {
        listaHorarios.style.display = 'block'; 
        await listarHorarios(); // Chama a função para listar horários
    }

    // Adiciona evento para as opções de visualização
    visualizacaoOptions.forEach(option => {
        option.addEventListener('change', async (event) => {
            if (event.target.value === 'pesquisar') {
                searchSection.style.display = 'block'; 
                listaHorarios.style.display = 'none'; 
            } else {
                searchSection.style.display = 'none'; 
                listaHorarios.style.display = 'block';
                await listarHorarios(); // Chama a função para listar horários
            }
        });
    });

    // Adiciona evento para o botão de pesquisa
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', async (event) => {
            event.preventDefault(); // Previne o refresh da página
            await pesquisarHorarios(); // Chama a função para pesquisar horários
        });
    } else {
        console.error('Botão de pesquisa não encontrado');
    }
}


  
  
  
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners2();
    preencherSelectEspecialidades('specialization');
    preencherSelectEspecialidades('specialization-search');

  });