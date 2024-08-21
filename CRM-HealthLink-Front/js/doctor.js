const ip = 'localhost';

async function listar_exames(token, doctorId) {
  if (!token) {
    alert('Usuário não autenticado.');
    return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/doctor/exams/${doctorId}`;

  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      renderExams(data);
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
}

async function listar_consultas(token, doctorId) {
  if (!token) {
    alert('Usuário não autenticado.');
    return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/doctor/appointment/${doctorId}`;

 
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      renderConsultations(data);
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
}

//Para o select do html, na hora de criar um exame
async function obterConsultas(token, doctorId) {
  const url = `http://${ip}:8080/crmhealthlink/api/doctor/appointment/${doctorId}`;

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

    const consultas = await response.json();
    return consultas; // Suponha que a resposta seja um array de consultas
  } catch (error) {
    console.error('Erro ao obter consultas:', error);
    return []; // Retorne um array vazio em caso de erro
  }
}

function preencherSelectConsultas(consultas) {
  const selectElement = document.getElementById('fk-appointment');
  
  if (!selectElement) {
    console.error('Elemento <select> não encontrado!');
    return;
  }

  selectElement.innerHTML = ''; // Limpa opções existentes

  // Adiciona uma opção padrão
  const optionDefault = document.createElement('option');
  optionDefault.value = '';
  optionDefault.textContent = 'Selecione uma consulta';
  selectElement.appendChild(optionDefault);

  // Preenche as opções do select
  consultas.forEach(consulta => {
    const option = document.createElement('option');
    option.value = consulta.id; // Ajuste conforme o campo de identificação da consulta
    option.textContent = consulta.description || 'Descrição'; // Ajuste conforme o campo de descrição
    selectElement.appendChild(option);
  });
}


async function criar_exame(token, doctorId, formData) {
  if (!token) {
    alert('Usuário não autenticado.');
    return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/doctor/exams/${doctorId}`;

  // Construa o corpo da requisição com os dados do formulário
  const requestBody = {
    id: formData.get('fk-appointment'), // O ID da consulta
    date: formData.get('exam-date'),     // Data do exame
    description: formData.get('exam-description'), // Descrição do exame
    namePatient: 'patient@example.com', // Substitua com o valor real ou ajuste conforme necessário
    nameDoctor: 'doctor@example.com',   // Substitua com o valor real ou ajuste conforme necessário
    descriptionAppointment: formData.get('exam-description2') // Descrição da consulta
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

    const data = await response.json();
    renderExams(data); // Supondo que `renderExams` é a função para processar a resposta
  } catch (error) {
    console.error('Erro na requisição:', error);
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

function updateUserName() {
  var userName = localStorage.getItem('userName');
  var welcomeMessage = document.getElementById('welcome-message');
  if (userName) {
    welcomeMessage.textContent = `Bem-vindo(a), ${userName}`;
  } else {
    welcomeMessage.textContent = 'Bem-vindo(a), Usuário';
  }
}



function renderExams(data) {
  const appointmentsList = document.getElementById('D-exams-list');

  if (!appointmentsList) {
    console.error('Elemento com ID "D-exams-list" não encontrado.');
    return;
  }

  appointmentsList.innerHTML = '';

  if (!Array.isArray(data)) {
    console.error('Os dados fornecidos não são uma lista de exames.');
    return;
  }

  data.forEach(exame => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${exame.id || 'ID não disponível'}</td>
      <td>${exame.date ? new Date(exame.date).toLocaleDateString() : 'Data não disponível'}</td>
      <td>${exame.description || 'Descrição não disponível'}</td>
      <td>${exame.namePatient || 'Nome do Paciente não disponível'}</td>
      <td>${exame.descriptionAppointment || 'Descrição da Consulta não disponível'}</td>
    `;

    appointmentsList.appendChild(row);
  });
}

function renderConsultations(data) {
  const appointmentsList = document.getElementById('appointments-list');
  appointmentsList.innerHTML = ''; 
  const consultas = data || listaDeConsultas;

  consultas.forEach(consulta => {
      const listItem = document.createElement('li');
      listItem.classList.add('item');
      
      const title = document.createElement('div');
      title.textContent = consulta.description || 'Descrição';
      title.classList.add('title');
      listItem.appendChild(title);
      
      const expandedContent = document.createElement('div');
      expandedContent.classList.add('expanded-content');
      expandedContent.innerHTML = `
          <p><strong>Data:</strong> ${new Date(consulta.date).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> ${new Date(consulta.date).toLocaleTimeString()}</p>
          <p><strong>Paciente:</strong> ${consulta.namePatient}</p>
      `;
      listItem.appendChild(expandedContent);
      
      title.addEventListener('click', () => {
          expandedContent.classList.toggle('show');
      });

      appointmentsList.appendChild(listItem);
  });
}






















async function setupEventListeners() {
  const form = document.getElementById('create-exam-form');

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Previne o envio padrão do formulário

      const token = 'YOUR_AUTH_TOKEN'; // Substitua com o seu token real
      const doctorId = 'YOUR_DOCTOR_ID'; // Substitua com o ID do médico real

      const formData = new FormData(form);

      await criar_exame(token, doctorId, formData);
    });
  }

  const backButton = document.getElementById('back-button');

  if (backButton) {
    backButton.addEventListener('click', () => {
      singOut(); // Substitua com a função real para deslogar
    });
  }

  // Carregar e preencher o select com as consultas
  const token = 'YOUR_AUTH_TOKEN'; // Substitua com o seu token real
  const doctorId = 'YOUR_DOCTOR_ID'; // Substitua com o ID do médico real
  const consultas = await obterConsultas(token, doctorId);
  preencherSelectConsultas(consultas); // Preenche o select com as consultas
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateUserName(); // Supondo que `updateUserName` é a função para atualizar o nome do usuário
});

