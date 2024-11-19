const ip = "localhost";


async function listar_consultas(token) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const patientName = localStorage.getItem("userName");
  const patientEmail = localStorage.getItem("email");

  const url = `http://${ip}:8080/api/patient/appointments/${patientName}/${patientEmail}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const data = await response.json();
    renderConsultations(data);
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

function renderConsultations(data) {
  const appointmentsList = document.getElementById("appointments-list");

  // Verifique se o elemento existe
  if (!appointmentsList) {
    console.error("Elemento appointments-list não encontrado no DOM.");
    return;
  }

  // Limpe a lista antes de inserir novos itens
  appointmentsList.innerHTML = "";

  // Itere sobre os dados das consultas
  data.forEach((consulta) => {
    const listItem = document.createElement("li");
    listItem.classList.add("item");

    // Crie o título da consulta
    const title = document.createElement("div");
    title.textContent = consulta.description || "Descrição";
    title.classList.add("title");
    listItem.appendChild(title);

    // Crie o conteúdo expandido com informações adicionais
    const expandedContent = document.createElement("div");
    expandedContent.classList.add("expanded-content");
    expandedContent.innerHTML = `
      <p><strong>Data:</strong> ${new Date(consulta.date).toLocaleDateString()}</p>
      <p><strong>Hora:</strong> ${new Date(consulta.date).toLocaleTimeString()}</p>
      <p><strong>Médico:</strong> ${consulta.nameDoctor}</p>
    `;
    listItem.appendChild(expandedContent);

    // Adicione evento de clique para expandir/contrair o conteúdo
    title.addEventListener("click", () => {
      expandedContent.classList.toggle("show");
    });

    // Adicione o item à lista
    appointmentsList.appendChild(listItem);
  });
}






async function listar_exames(token) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const patientName = localStorage.getItem("userName");
  const patientEmail = localStorage.getItem("email");

  const url = `http://${ip}:8080/api/patient/exams/${patientName}/${patientEmail}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const data = await response.json();
    renderExams(data);
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

function renderExams(data) {
  const examsList = document.getElementById("exams-list");

  // Verifique se o elemento exams-list existe no DOM
  if (!examsList) {
    console.error("Elemento exams-list não encontrado no DOM.");
    return;
  }

  // Limpe a lista antes de inserir novos itens
  examsList.innerHTML = "";

  // Itere sobre os dados dos exames
  data.forEach((exame) => {
    const listItem = document.createElement("li");
    listItem.classList.add("item");

    // Crie o título do exame
    const title = document.createElement("div");
    title.textContent = exame.description || "Descrição";
    title.classList.add("title");
    listItem.appendChild(title);

    // Crie o conteúdo expandido com informações adicionais
    const expandedContent = document.createElement("div");
    expandedContent.classList.add("expanded-content");
    expandedContent.innerHTML = `
      <p><strong>Data:</strong> ${new Date(exame.date).toLocaleDateString()}</p>
      <p><strong>Hora:</strong> ${new Date(exame.date).toLocaleTimeString()}</p>
      <p><strong>Médico:</strong> ${exame.nameDoctor}</p>
    `;
    listItem.appendChild(expandedContent);

    // Adicione evento de clique para expandir/contrair o conteúdo
    title.addEventListener("click", () => {
      expandedContent.classList.toggle("show");
    });

    // Adicione o item à lista
    examsList.appendChild(listItem);
  });
}


async function preencherSelectEspecialidades(selectId) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return;
  }

  const url = `http://${ip}:8080/api/employee/allspecialities`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const especialidades = await response.json();
    renderEspecialidadesSelect(especialidades, selectId);
  } catch (error) {
    console.error("Erro ao preencher o select com especialidades:", error);
  }
}

function renderEspecialidadesSelect(especialidades, selectId) {
  const selectElement = document.getElementById(selectId);

  if (!selectElement) {
    console.error("Elemento <select> não encontrado!");
    return;
  }

  selectElement.innerHTML = "";

  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Selecione uma especialidade";
  selectElement.appendChild(optionDefault);

  especialidades.forEach((especialidade) => {
    const option = document.createElement("option");
    option.value = especialidade; // O valor da especialidade em si, Ñ ESTÁ PEGANDO
    option.textContent = especialidade || "Nome não disponível";
    selectElement.appendChild(option);
  });

}



// Nova função para agendar a consulta
async function agendarConsulta() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const date = document.getElementById("appointment-date").value;
  const startTime = document.getElementById("start-time").value;
  const endTime = document.getElementById("end-time").value;
  const specialityType = document.getElementById("speciality-type").value;

  const data = {
    date: date,
    homeTime: { hour: parseInt(startTime.split(":")[0]), minute: parseInt(startTime.split(":")[1]) },
    endTime: { hour: parseInt(endTime.split(":")[0]), minute: parseInt(endTime.split(":")[1]) },
    specialityType: specialityType,
  };

  console.log("Dados enviados:", JSON.stringify(data));


  try {
    const response = await fetch(`http://${ip}:8080/api/calendario/associateDoctor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    alert("Consulta marcada com sucesso!");
  } catch (error) {
    console.error("Erro ao marcar consulta:", error);
  }
}

// Adiciona o evento de envio do formulário
const appointmentForm = document.getElementById("appointment-form");

appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Previne o envio padrão do formulário
  agendarConsulta(); // Chama a função de agendar
});


function tokenValidation() {
  var token = localStorage.getItem("token");
  var pacienteId = localStorage.getItem("id");
  if (token == null) {
    window.location.href = "../index.html";
  } else {
    listar_consultas(token, pacienteId);
    listar_exames(token, pacienteId);
  }
}

tokenValidation();

function singOut() {
  if (typeof localStorage !== "undefined") {
    localStorage.clear();
    alert("Você foi desconectado com sucesso.");
    window.location.href = "/pages/login.html"; 
  } else {
    console.error("Local storage não está disponível.");
  }
}

function updateUserName() {
  var userName = localStorage.getItem("userName");
  var welcomeMessage = document.getElementById("welcome-message");
  if (userName) {
    welcomeMessage.textContent = `Bem-vindo(a), ${userName}`;
  } else {
    welcomeMessage.textContent = "Bem-vindo(a), Usuário";
  }
}


function setupEventListeners() {
  const backButton = document.getElementById("back-button");

  if (backButton) {
    backButton.addEventListener("click", () => {
      singOut();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  updateUserName();
  preencherSelectEspecialidades("speciality-type");
});
