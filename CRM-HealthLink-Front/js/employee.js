const ip = 'localhost'; 

async function buscarPaciente(token, pacienteId) {
  if (!token) {
    alert('Usuário não autenticado.');
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




  //crirar paciente
  async function criarPaciente(token, data) {
    if (!token) {
        alert('Usuário não autenticado.');
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
        handleCreationResult('success'); // Chama a função unificada com status de sucesso
    } catch (error) {
        console.error('Erro na requisição:', error);
        handleCreationResult('error'); // Chama a função unificada com status de erro
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
        alert('Usuário não autenticado.');
        return;
    }

    const url = `http://${ip}:8080/crmhealthlink/api/employee/paciente/${pacienteId}`; // Atualize conforme necessário

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
              await listarPacientes(token); 
              await preencherSelectPacientes();
           }
          break;
      
      default:
          resultsDiv.innerText = 'Status desconhecido.';
          break;
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




//Atualizar paciente
async function atualizarPaciente(token, data) {
  if (!token) {
      alert('Usuário não autenticado.');
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
      alert('Usuário não autenticado.');
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

          // Converte FormData para um objeto simples
          const data = {};
          formData.forEach((value, key) => {
              data[key] = value;
          });

          await atualizarPaciente(token, data);
      });
  }
  }




  
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateUserName(); 
    setupPacienteForm();
  });
  