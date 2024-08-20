const ip = 'localhost';

async function listar_consultas(token, pacienteId) {
  if (!token) {
    alert('Usuário não autenticado.');
    return;
  }

  const url = `http://localhost:8080/crmhealthlink/api/patient/appointments/${pacienteId}`;

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
      return response.json(); // Parse JSON data
    })
    .then(data => {
      console.log(data); // Manipule os dados retornados aqui
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
}

function getToken() {
  var token = localStorage.getItem('token');
  var pacienteId = localStorage.getItem('id');
  if (token == null) {
    window.location.href = '../index.html';
  } else {
    alert(token)
    listar_consultas(token, pacienteId); // Certifique-se de que o ID do paciente está correto
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
