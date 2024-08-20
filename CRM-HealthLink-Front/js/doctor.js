const ip = '10.36.20.71';

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
      alert(data)
      renderExams(data);
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
}

function getToken() {
  var token = localStorage.getItem('token');
  var doctorId = localStorage.getItem('id');
  if (token == null) {
    window.location.href = '../index.html';
    listar_exames(token, pacienteId)
  } else {


  }
}

getToken();

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
  console.log(data)
  const exames = data;
  console.log(exames)
  exames.forEach(exames => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${exames.id}</td>
      <td>${exames.namePatient || 'Nome do Paciente'}</td>
      <td>${exames.date ? new Date(consulta.date).toLocaleDateString() : 'Data de Nascimento'}</td>
      <td>${exames.cpf || 'CPF'}</td>
      <td>${exames.namePatient || 'Email'}</td>
    `;

    appointmentsList.appendChild(row);
  });
}



function setupEventListeners() {
  const backButton = document.getElementById('back-button');

  if (backButton) {
    backButton.addEventListener('click', () => {
      singOut();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateUserName();
});
