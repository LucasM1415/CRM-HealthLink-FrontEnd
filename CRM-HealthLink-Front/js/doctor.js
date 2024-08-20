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
      console.log(data);
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
  } else {
    var patientName = localStorage.getItem('userName')
    alert(patientName)
  }
}

getToken();

function singOut() {
  if (typeof localStorage !== "undefined") {
    localStorage.clear();
    alert("Você foi desconectado com sucesso.");
    window.location.href = "../index.html";
  } else {
    console.error("Local storage não está disponível.");
  }
}


const listaDeConsultas = [
  {
    id: 1,
    date: "2024-08-21T09:49:35.345809",
    description: "Consulta de rotina",
    namePatient: "patient1@email.com",
    nameDoctor: "doctor1@email.com"
  },
  {
    id: 2,
    date: "2024-08-22T10:30:00.000000",
    description: "Exame de sangue",
    namePatient: "patient2@email.com",
    nameDoctor: "doctor2@email.com"
  },
  {
    id: 3,
    date: "2024-08-23T11:15:45.123456",
    description: "Check-up geral",
    namePatient: "patient3@email.com",
    nameDoctor: "doctor3@email.com"
  },
  {
    id: 4,
    date: "2024-08-24T14:00:00.654321",
    description: "Consulta com especialista",
    namePatient: "patient4@email.com",
    nameDoctor: "doctor4@email.com"
  },
  {
    id: 5,
    date: "2024-08-25T16:45:30.789012",
    description: "Consulta de emergência",
    namePatient: "patient5@email.com",
    nameDoctor: "doctor5@email.com"
  }
];


const listaDeExames = [
  {
    id: 1,
    date: "2024-08-20T11:08:57.26",
    description: "Exame de sangue completo",
    namePatient: "patient1@email.com",
    nameDoctor: "doctor1@email.com",
    descriptionAppointment: null
  },
  {
    id: 2,
    date: "2024-08-21T12:30:00.00",
    description: "Ressonância magnética",
    namePatient: "patient2@email.com",
    nameDoctor: "doctor2@email.com",
    descriptionAppointment: null
  },
  {
    id: 3,
    date: "2024-08-22T14:15:30.00",
    description: "Ultrassonografia abdominal",
    namePatient: "patient3@email.com",
    nameDoctor: "doctor3@email.com",
    descriptionAppointment: null
  },
  {
    id: 4,
    date: "2024-08-23T09:00:00.00",
    description: "Teste de glicose",
    namePatient: "patient4@email.com",
    nameDoctor: "doctor4@email.com",
    descriptionAppointment: null
  },
  {
    id: 5,
    date: "2024-08-24T10:45:00.00",
    description: "Eletrocardiograma",
    namePatient: "patient5@email.com",
    nameDoctor: "doctor5@email.com",
    descriptionAppointment: null
  }
];





