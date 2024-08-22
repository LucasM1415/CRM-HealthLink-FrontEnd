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

function getToken() {
    var token = localStorage.getItem('token');
    var userid = localStorage.getItem('id');
    if (token == null) {
      window.location.href = '../index.html';
    } else {
      listar_consultas(token, userid)  
      listar_exames(token, userid);
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

function updateUserName() {
    const userName = localStorage.getItem('userName');
    const welcomeMessage = document.getElementById('welcome-message');
    if (userName) {
      welcomeMessage.textContent = `Bem-vindo(a), ${userName}`;
    } else {
      welcomeMessage.textContent = 'Bem-vindo(a), Usuário';
    }
  }
  
  // Função para configurar listeners de eventos
  async function setupEventListeners() {
    const form = document.getElementById('paciente-form');
  
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o comportamento padrão de envio do formulário
        
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
  }
  
  // Inicializa a configuração dos listeners e atualiza o nome do usuário
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateUserName(); 
  });