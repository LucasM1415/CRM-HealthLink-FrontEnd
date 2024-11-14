const ip = 'localhost';

async function listar_exames(token, doctorEmail) {
  if (!token) {
    alert('Usuário não autenticado.');
    return;
  }

  const url = `http://${ip}:8080/api/doctor/exams/${doctorEmail}`;

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

async function listar_consultas(token, doctorEmail) {
  if (!token) {
    alert('Usuário não autenticado.');
    return;
  }

  const url = `http://${ip}:8080/api/doctor/appointment/${doctorEmail}`;

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

async function obterConsultas(token, doctorEmail) {
  const url = `http://${ip}:8080/api/doctor/appointment/${doctorEmail}`;

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

  const url = `http://${ip}:8080/api/doctor`;

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
    alert('Exame criado com sucesso!');
    reloadExams(responseData);

  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Não foi possível criar o exame. Por favor, tente novamente.');
  }
}

async function obterEspecialidades(token) {
  const url = `http://${ip}:8080/api/calendario/specialty`;

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

    const especialidades = await response.json();
    renderEspecialidades(especialidades);
  } catch (error) {
    console.error('Erro ao obter especialidades:', error);
  }
}

function renderEspecialidades(especialidades) {
  const specialtiesList = document.getElementById('specialties-list'); // Certifique-se de ter um elemento com esse ID

  if (!specialtiesList) {
    console.error('Elemento com ID "specialties-list" não encontrado.');
    return;
  }

  specialtiesList.innerHTML = '';

  especialidades.forEach(especialidade => {
    const listItem = document.createElement('li');
    listItem.textContent = especialidade.specialityType || 'Tipo de Especialidade não disponível';
    specialtiesList.appendChild(listItem);
  });
}

function tokenValidation() {
  var token = localStorage.getItem('token');
  var userEmail = localStorage.getItem('email');
  var doctorCRM = localStorage.getItem('crm')
  if (token == null) {
    window.location.href = '../index.html';
  } else {
    listar_consultas(token, doctorCRM);  
    listar_exames(token, doctorCRM);
  }
}

tokenValidation();

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

function reloadExams(data) {
  const appointmentsList = document.getElementById('D-exams-list');
  const row = document.createElement('tr');
  
  row.innerHTML = `
      <td>${data.id || 'ID não disponível'}</td>
      <td>${data.date ? new Date(data.date).toLocaleDateString() : 'Data não disponível'}</td>
      <td>${data.description || 'Descrição não disponível'}</td>
      <td>${data.namePatient || 'Nome do Paciente não disponível'}</td>
    `;

  appointmentsList.appendChild(row);
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
      const userEmail = localStorage.getItem('email');

      // Coletar dados do formulário e criar um objeto JavaScript
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
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
  var userEmail = localStorage.getItem('email');
  var doctorCRM = localStorage.getItem('crm')
  const consultas = await obterConsultas(token, doctorCRM);
  preencherSelectConsultas(consultas); 
}



document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateUserName();
});


// Lista padrão de especialidades
const defaultSpecialties = localStorage.getItem('speciality')

// Função para verificar e carregar especialidades do localStorage
function loadSpecialties() {
  // Verifica se as especialidades já estão no localStorage
  if (!localStorage.getItem("speciality")) {
      // Se não estiverem, armazena a string padrão no localStorage
      localStorage.setItem("speciality", defaultSpecialties);
  }

  // Retorna a lista de especialidades como array, separando a string pelo separador de vírgulas
  return localStorage.getItem("speciality").split(",");
}

// Função para preencher o seletor dinamicamente
function populateSpecialtySelector() {
  const specialtySelect = document.getElementById("specialty");
  const specialties = loadSpecialties(); // Carrega as especialidades do localStorage como array

  // Adiciona cada especialidade como uma nova opção
  specialties.forEach(specialty => {
      const option = document.createElement("option");
      option.value = specialty.toLowerCase();
      option.textContent = specialty;
      specialtySelect.appendChild(option);
  });
}

// Chama a função quando a página é carregada
window.onload = populateSpecialtySelector;



function showSection(sectionId) {
  document.querySelectorAll('main section').forEach(section => {
      section.classList.add('section-hidden');
  });
  document.getElementById(sectionId).classList.remove('section-hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  showSection('Calendario');
});

function generateCalendar() {
  const specialty = document.getElementById("specialty").value;
  console.log(specialty)

  const month = parseInt(document.getElementById("month").value);
  const year = parseInt(document.getElementById("year").value);
  console.log(month)
  console.log(year)
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = ''; // Limpa o calendário anterior

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "calendar-day";
      dayElement.textContent = day;
      dayElement.onclick = () => showDayDetails(day, month + 1, year);
      calendar.appendChild(dayElement);
  }
}

function showDayDetails(day, month, year) {
  const details = document.getElementById("day-details");
  details.style.display = "block";
  document.getElementById("selected-day-info").textContent = `Informações para ${day}/${month}/${year}`;
}

