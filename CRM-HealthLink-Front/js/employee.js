const ip = 'localhost'; 
//buscar Paciente
async function buscarPaciente(token, pacienteId) {
  if (!token) {
    ('Usuário não autenticado.');
    return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/employee/getpaciente/${pacienteId}`; 

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
    renderPaciente(data);
  } catch (error) {
    console.error('Erro na requisição:', error);
    document.getElementById('results').innerText = 'Erro ao buscar paciente.';
  }
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

//Listar paciente
async function listarPacientes(token) {
    if (!token) {
      ('Usuário não autenticado.');
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




  //criar paciente
  async function criarPaciente(token, data) {
    if (!token) {
        ('Usuário não autenticado.');
        return;
    }
  
    const url = `http://${ip}:8080/crmhealthlink/api/employee/create/patient`; 
  
    const requestBody = {
        name: data['criar-paciente-nome'],
        birthDate: data['criar-paciente-data-nascimento'],
        cpf: data['criar-paciente-cpf'],
        email: data['criar-paciente-email'],
        password: data['criar-paciente-password'], 
        acessLevel: 'PATIENT' 
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
        handleCreationResult('success'); 
    } catch (error) {
        console.error('Erro na requisição:', error);
        handleCreationResult('error'); 
    }
  }
  
  
  // Função para lidar com o resultado da criação
  async function handleCreationResult(status) {
    const resultsDiv = document.getElementById('results');
    
    switch (status) {
        case 'success':
            resultsDiv.innerText = 'Paciente criado com sucesso!';
            break;
        
        case 'error':
            const token = localStorage.getItem('token');
            if (token) {
                await listarPacientes(token); 
                await preencherSelectPacientes();
                await listarHorarios(token);
                
             }
            break;
        
        default:
            resultsDiv.innerText = 'Status desconhecido.';
            break;
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

  //Remover paciente
  async function removerPaciente(token, pacienteId) {
    if (!token) {
        ('Usuário não autenticado.');
        return;
    }

    const url = `http://${ip}:8080/crmhealthlink/api/employee/paciente/${pacienteId}`; 

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const data = await response.json(); 
        handleRemovalResult('success'); 
    } catch (error) {
        console.error('Erro na requisição:', error);
        handleRemovalResult('error'); 
    }
}

async function handleRemovalResult(status) {
  const resultsDiv = document.getElementById('results');
  
  switch (status) {
      case 'success':
          resultsDiv.innerText = 'Paciente removido com sucesso!';
          
          break;
      
      case 'error':
          const token = localStorage.getItem('token');
          if (token) {
              await listarConsultas(token); 
              await preencherSelectPacientes();
           }
          break;
      
      default:
          resultsDiv.innerText = 'Status desconhecido.';
          break;
  }
}

async function configureConsultaRemovalListeners() {
  const form = document.getElementById('remover-consulta-form');

  if (form) {
      form.addEventListener('submit', async (event) => {
          event.preventDefault(); // Evita o envio padrão do formulário

          const consultaId = document.getElementById('remover-consulta-id').value.trim(); 
          const token = localStorage.getItem('token'); 

          if (consultaId === '') {
              document.getElementById('consulta-results').innerText = 'Por favor, insira o ID da consulta.';
              return;
          }

          await removerConsulta(token, consultaId);
      });
  }
}





//Atualizar paciente
async function atualizarPaciente(token, data) {
  if (!token) {
      ('Usuário não autenticado.');
      return;
  }

  const pacienteId = data['update-paciente-id'];
  const url = `http://${ip}:8080/crmhealthlink/api/employee/update/patient/${pacienteId}`;

  const requestBody = {
      name: data['update-paciente-nome'],
      birthDate: data['update-paciente-data-nascimento'],
      cpf: data['update-paciente-cpf'],
      email: data['update-paciente-email'],
      password: data['update-paciente-password']
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

      const responseData = await response.json();
      handleUpdateResult('success');
  } catch (error) {
      console.error('Erro na requisição:', error);
      handleUpdateResult('error');
  }
}


async function preencherSelectPacientes() {
  const token = localStorage.getItem('token');
  if (!token) {
      console.error('Token não encontrado no localStorage');
      return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/employee/pacientes`;

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

      const pacientes = await response.json();
      renderPacientesSelect(pacientes);
  } catch (error) {
      console.error('Erro ao preencher o select com pacientes:', error);
  }
}

function renderPacientesSelect(pacientes) {
  const selectElement = document.getElementById('update-paciente-id');

  if (!selectElement) {
      console.error('Elemento <select> não encontrado!');
      return;
  }

  selectElement.innerHTML = '';

  const optionDefault = document.createElement('option');
  optionDefault.value = '';
  optionDefault.textContent = 'Selecione um paciente';
  selectElement.appendChild(optionDefault);

  pacientes.forEach(paciente => {
      const option = document.createElement('option');
      option.value = paciente.id;
      option.textContent = paciente.name || 'Nome não disponível';
      selectElement.appendChild(option);
  });
}

async function atualizarPaciente(token, data) {
  if (!token) {
      
      return;
  }

  const pacienteId = data['update-paciente-id'];
  const url = `http://${ip}:8080/crmhealthlink/api/employee/paciente/${pacienteId}`;

  const requestBody = {
      name: data['update-paciente-nome'],
      birthDate: data['update-paciente-data-nascimento'],
      cpf: data['update-paciente-cpf'],
      email: data['update-paciente-email'],
      password: data['update-paciente-password'] 
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

      const responseData = await response.json();
      handleUpdateResult('success'); 
  } catch (error) {
      console.error('Erro na requisição:', error);
      handleUpdateResult('error'); 
  }
}


async function handleUpdateResult(status) {
  const resultsDiv = document.getElementById('results3');
  
  if (!resultsDiv) {
      console.error('Elemento <div id="results3"> não encontrado!');
      return;
  }

  if (status === 'success') {
    const token = localStorage.getItem('token');
    if (token) {
        await listarPacientes(token); 
     }
  } else if (status === 'error') {
    const token = localStorage.getItem('token');
    if (token) {
        await listarPacientes(token); 
        await preencherSelectPacientes()
     }
  } else {
      resultsDiv.innerHTML = '<p>Estado desconhecido.</p>';
      resultsDiv.style.color = 'orange'; 
  }
}

//Obter médico
async function buscarMedico(token, medicoId) {
  if (!token) {
    
    return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/employee/doctor/${medicoId}`; 

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
    renderMedico(data);
  } catch (error) {
    console.error('Erro na requisição:', error);
    document.getElementById('medico-results').innerText = 'Erro ao buscar médico.';
  }
}

function renderMedico(data) {
  const resultsDiv = document.getElementById('medico-results');
  resultsDiv.innerHTML = ''; 

  if (data) {
    resultsDiv.innerHTML = `
      <p><strong>Nome:</strong> ${data.name}</p>
      <p><strong>Data de Nascimento:</strong> ${data.birthDate}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>CRM:</strong> ${data.crm}</p>
    `;
  } else {
    resultsDiv.innerText = 'Nenhum médico encontrado.';
  }
}



//listar medicos
async function listarMedicos(token) {
  if (!token) {
      
      return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/employee/doctors`; 

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
      renderMedicos(data);

  } catch (error) {
      console.error('Erro na requisição:', error);
      const resultsTable = document.querySelector('#list-medicos-tbody');
      resultsTable.innerHTML = '<tr><td colspan="7">Erro ao listar médicos.</td></tr>';
  }
}


function renderMedicos(medicos) {
  const tbody = document.querySelector('#list-medicos-tbody');

  if (!tbody) {
      console.error('Elemento <tbody> não encontrado!');
      return;
  }

  tbody.innerHTML = '';

  medicos.forEach(medico => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${medico.id}</td>
          <td>${medico.name || 'Nome não disponível'}</td>
          <td>${medico.birthDate || 'Data não disponível'}</td>
          <td>${medico.email || 'Email não disponível'}</td>
          <td>${medico.crm || 'CRM não disponível'}</td>
          <td>${medico.specialty || 'Especialização não disponível'}</td>
      `;
      tbody.appendChild(row);
  });
}


//Criar consulta
async function criarNovaConsulta() {
  const token = localStorage.getItem('token');
  if (!token) {
      return;
  }

  const datahora = document.getElementById('criar-consulta-datahora').value;
  const medicoId = document.getElementById('criar-consulta-medico').value;
  const pacienteId = document.getElementById('criar-consulta-paciente').value;
  const descricao = document.getElementById('criar-consulta-descricao').value;

  if (!datahora || !medicoId || !pacienteId || !descricao) {
      alert('Por favor, preencha todos os campos.');
      return;
  }


  const corpoRequisicao = {
      fk_patient: pacienteId, 
      fk_doctor: medicoId,
      fk_employee: localStorage.getItem('id'), 
      data: datahora, 
      description: descricao
  };

  const url = `http://${ip}:8080/crmhealthlink/api/appointment`;

  try {
      
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(corpoRequisicao)
      });

      if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('Resultado:', result);


  } catch (error) {
      console.error('Erro ao criar a consulta:', error);
      alert('Erro ao criar a consulta. Veja o console para detalhes.');
  }
}


//Listar consultas
async function listarConsultas(token) {
  if (!token) {
    ('Usuário não autenticado.');
    return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/appointment`; 

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
    renderConsultas(data);

  } catch (error) {
    console.error('Erro na requisição:', error);
    const resultsTable = document.querySelector('#list-consultas-tbody');
    resultsTable.innerHTML = '<tr><td colspan="6">Erro ao listar consultas.</td></tr>';
  }
}

function renderConsultas(consultas) {
  const tableBody = document.querySelector('#list-consultas-tbody');

  if (!tableBody) {
    console.error('Elemento <tbody> não encontrado!');
    return;
  }

  tableBody.innerHTML = '';

  consultas.forEach(consulta => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${consulta.id || 'ID não disponível'}</td>
      <td>${consulta.namePatient || 'Paciente não disponível'}</td>
      <td>${consulta.nameDoctor || 'Médico não disponível'}</td>
      <td>${consulta.date || 'Data não disponível'}</td>
      <td>${consulta.description || 'Descrição não disponível'}</td>
      
    `;

    tableBody.appendChild(row);
  });
}


async function preencherSelectPacientes() {
  const token = localStorage.getItem('token');
  if (!token) {
      console.error('Token não encontrado no localStorage');
      return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/employee/pacientes`;

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

      const pacientes = await response.json();
      renderPacientesSelect(pacientes);
  } catch (error) {
      console.error('Erro ao preencher o select com pacientes:', error);
  }
}

function renderPacientesSelect(pacientes) {
  const selectElement = document.getElementById('criar-consulta-paciente');

  if (!selectElement) {
      console.error('Elemento <select> não encontrado!');
      return;
  }

  selectElement.innerHTML = '';

  const optionDefault = document.createElement('option');
  optionDefault.value = '';
  optionDefault.textContent = 'Selecione um paciente';
  selectElement.appendChild(optionDefault);

  pacientes.forEach(paciente => {
      const option = document.createElement('option');
      option.value = paciente.id;
      option.textContent = paciente.name || 'Nome não disponível';
      selectElement.appendChild(option);
  });
}
async function preencherSelectMedicos() {
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
      renderMedicosSelect(medicos);
  } catch (error) {
      console.error('Erro ao preencher o select com médicos:', error);
  }
}

async function preencherSelectMedicos() {
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
      renderMedicosSelect(medicos);
  } catch (error) {
      console.error('Erro ao preencher o select com médicos:', error);
  }
}

function renderMedicosSelect(medicos) {
  const selectElement = document.getElementById('criar-consulta-medico');

  if (!selectElement) {
      console.error('Elemento <select> não encontrado!');
      return;
  }

  selectElement.innerHTML = '';

  const optionDefault = document.createElement('option');
  optionDefault.value = '';
  optionDefault.textContent = 'Selecione um médico';
  selectElement.appendChild(optionDefault);

  medicos.forEach(medico => {
      const option = document.createElement('option');
      option.value = medico.id;
      option.textContent = medico.name || 'Nome não disponível';
      selectElement.appendChild(option);
  });
}


//Obter consulta
async function buscarConsulta(token, consultaId) {
  if (!token) {
  
    return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/appointment/${consultaId}`; 

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
    renderConsulta(data);
  } catch (error) {
    console.error('Erro na requisição:', error);
    document.getElementById('consulta-results').innerText = 'Erro ao buscar consulta.';
  }
}

function renderConsulta(data) {
  const resultsDiv = document.getElementById('consulta-results');
  resultsDiv.innerHTML = ''; 

  if (data) {
    resultsDiv.innerHTML = `
      <p><strong>Paciente:</strong> ${data.namePatient}</p>
      <p><strong>Médico:</strong> ${data.nameDoctor}</p>
      <p><strong>Data:</strong> ${data.date}</p>
      <p><strong>Descrição:</strong> ${data.description}</p>
     
    `;
  } else {
    resultsDiv.innerText = 'Nenhuma consulta encontrada.';
  }
}

//remover consultas
async function removerConsulta(token, consultaId) {
  if (!token) {
      
      return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/appointment/${consultaId}`; 

  try {
      const response = await fetch(url, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
      }

      const data = await response.json(); 
      await handleRemovalResult('success');
  } catch (error) {
      console.error('Erro na requisição:', error);
      await handleRemovalResult('error');
  }
}


async function handleRemovalResult(status) {
  const resultsDiv = document.getElementById('consulta-results');
  
  switch (status) {
      case 'success':
          resultsDiv.innerText = 'Consulta removida com sucesso!';
          break;
      
      case 'error':
          const token = localStorage.getItem('token');
          if (token) {
              await listarConsultas(token); 
          }
          break;
      
      default:
          resultsDiv.innerText = 'Status desconhecido.';
          break;
  }
}
async function setupRemovalEventListeners() {
  const form = document.getElementById('remover-consulta-form');

  if (form) {
      form.addEventListener('submit', async (event) => {
          event.preventDefault(); 

          const consultaId = document.getElementById('remover-consulta-id').value.trim(); 
          const token = localStorage.getItem('token'); 

          if (consultaId === '') {
              document.getElementById('consulta-results').innerText = 'Por favor, insira o ID da consulta.';
              return;
          }

          await removerConsulta(token, consultaId);
      });
  }
}





function getToken() {
    var token = localStorage.getItem('token');
    var userid = localStorage.getItem('id');
    if (token == null) {
      window.location.href = '../index.html';
    } else {
      listarPacientes(token, userid)
      listarMedicos(token, userid)
      listarConsultas(token, userid); 
    }
  }
  
  function singOut() {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
      ("Você foi desconectado com sucesso.");
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
  

  async function setupEventListeners() {
    await setupRemovalEventListeners();
    const form = document.getElementById('paciente-form');
  
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        const token = localStorage.getItem('token');
        const pacienteId = document.getElementById('obter-paciente-id').value;
  
        await buscarPaciente(token, pacienteId);
      });
    }
  
    const backButton = document.getElementById('back-button');
  
    if (backButton) {
      backButton.addEventListener('click', () => {
        singOut(); 
      });
    }
    const token = localStorage.getItem('token');
    if (token) {
      try {
          await listarPacientes(token);
          await preencherSelectPacientes();
          await preencherSelectMedicos();
          await listarMedicos(token);
          await listarConsultas(token);
         
      } catch (error) {
          console.error('Erro ao preencher o select com pacientes:', error);
      }
  }
  const updateForm = document.getElementById('update-paciente-form');
  if (updateForm) {
      updateForm.addEventListener('submit', async (event) => {
          event.preventDefault(); 

          const token = localStorage.getItem('token');
          const formData = new FormData(updateForm);

          
          const data = {};
          formData.forEach((value, key) => {
              data[key] = value;
          });

          await atualizarPaciente(token, data);
      });
  }
  const medicoForm = document.getElementById('medico-form');
  if (medicoForm) {
    medicoForm.addEventListener('submit', async (event) => {
      event.preventDefault(); 

      const token = localStorage.getItem('token');
      const medicoId = document.getElementById('obter-doutor-id').value;
      
      await buscarMedico(token, medicoId);
    });
  }
  }
  const consultaForm = document.getElementById('consulta-form');
  if (consultaForm) {
    consultaForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const token = localStorage.getItem('token');
      const consultaId = document.getElementById('obter-consulta-id').value;
      await buscarConsulta(token, consultaId);
    });
  }
  const formCriarConsulta = document.getElementById('form-criar-consulta');
    if (formCriarConsulta) {
        formCriarConsulta.addEventListener('submit', async (event) => {
            event.preventDefault();
            await criarNovaConsulta();
            await listarConsultas();
        });
    }


  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateUserName(); 
    setupPacienteForm();
  });
  