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
    return consultas; 
  } catch (error) {
    console.error('Erro ao obter consultas:', error);
    return []; 
  }
}

function preencherSelectConsultas(consultas) {
  const selectElement = document.getElementById('fk-appointment');
  
  if (!selectElement) {
    console.error('Elemento <select> não encontrado!');
    return;
  }

  selectElement.innerHTML = ''; 

  
  const optionDefault = document.createElement('option');
  optionDefault.value = '';
  optionDefault.textContent = 'Selecione uma consulta';
  selectElement.appendChild(optionDefault);

 
  consultas.forEach(consulta => {
    const option = document.createElement('option');
    option.value = consulta.id; 
    option.textContent = consulta.description || 'Descrição'; 
    selectElement.appendChild(option);
  });
}



async function criar_exame(token,data) {
  if (!token) {
    alert('Usuário não autenticado.');
    return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/doctor`;

  const requestBody = {
    fk_appointment: data['fk-appointment'],
    date: data['exam-date'],
    descricao: data['exam-description'],
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
    renderExams(responseData);

    alert('Exame criado com sucesso!');
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Não foi possível criar o exame. Por favor, tente novamente.');
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
      event.preventDefault(); // Impede o comportamento padrão de envio do formulário
      
      const token = localStorage.getItem('token');
      const userid = localStorage.getItem('id');

      // Coletar dados do formulário e criar um objeto JavaScript
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        console.log(`value: ${value}`)
        console.log(`key: ${key}`)
        data[key] = value;
      });

      await criar_exame(token, data);
    });
  }

  const backButton = document.getElementById('back-button');

  if (backButton) {
    backButton.addEventListener('click', () => {
      singOut(); 
    });
  }

  const token = localStorage.getItem('token');
  const userid = localStorage.getItem('id');
  const consultas = await obterConsultas(token, userid);
  preencherSelectConsultas(consultas); 
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateUserName(); 
});

