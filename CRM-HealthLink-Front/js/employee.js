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

async function removerPaciente(token, pacienteId) {
    if (!token) {
      alert('Usuário não autenticado.');
      return;
    }
  
    const url = `http://${ip}:8080/crmhealthlink/api/employee/paciente/${pacienteId}`; // Atualize a rota conforme necessário
  
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
      alert('Paciente removido com sucesso!');
      // Recarregue a lista de pacientes ou atualize a interface conforme necessário
      await listarPacientes(token); // Atualiza a lista de pacientes após a remoção
    } catch (error) {
      console.error('Erro na requisição:', error);
      document.getElementById('results').innerText = 'Erro ao remover paciente.';
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
    await listarPacientes(token);
  }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateUserName(); 
  });