const ip = "localhost";


async function listar_consultas(token, pacienteId) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/patient/appointments/${pacienteId}`;

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderConsultations(data);
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
    });
}

async function listar_exames(token, pacienteId) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/crmhealthlink/api/patient/exams/${pacienteId}`;

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderExams(data);
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
    });
}

const turnSelect = document.getElementById("appointment-turn");
const blockSelect = document.getElementById("appointment-block");

function updateBlocks() {
  const selectedTurn = turnSelect.value;

  const blocks = blockSelect.options;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].classList.contains(selectedTurn)) {
      blocks[i].style.display = "block";
    } else {
      blocks[i].style.display = "none";
    }
  }

  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].style.display === "block") {
      blockSelect.value = blocks[i].value;
      break;
    }
  }
}

turnSelect.addEventListener("change", updateBlocks);
updateBlocks();

const appointmentForm = document.getElementById("appointment-form");

appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  alert("Consulta marcada com sucesso!");
  appointmentForm.reset();
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
    window.location.href = "../pages/login.html";
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

function renderConsultations(data) {
  const appointmentsList = document.getElementById("appointments-list");
  appointmentsList.innerHTML = "";
  const consultas = data || listaDeConsultas;

  consultas.forEach((consulta) => {
    const listItem = document.createElement("li");
    listItem.classList.add("item");

    const title = document.createElement("div");
    title.textContent = consulta.description || "Descrição";
    title.classList.add("title");
    listItem.appendChild(title);

    const expandedContent = document.createElement("div");
    expandedContent.classList.add("expanded-content");
    expandedContent.innerHTML = `
          <p><strong>Data:</strong> ${new Date(
            consulta.date
          ).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> ${new Date(
            consulta.date
          ).toLocaleTimeString()}</p>
          <p><strong>Médico:</strong> ${consulta.nameDoctor}</p>
      `;
    listItem.appendChild(expandedContent);

    title.addEventListener("click", () => {
      expandedContent.classList.toggle("show");
    });

    appointmentsList.appendChild(listItem);
  });
}

function renderExams(data) {
  const examsList = document.getElementById("exams-list");
  examsList.innerHTML = "";
  const exames = data || listaDeExames;

  exames.forEach((exame) => {
    const listItem = document.createElement("li");
    listItem.classList.add("item");

    const title = document.createElement("div");
    title.textContent = exame.description || "Descrição";
    title.classList.add("title");
    listItem.appendChild(title);

    const expandedContent = document.createElement("div");
    expandedContent.classList.add("expanded-content");
    expandedContent.innerHTML = `
      <p><strong>Data:</strong> ${new Date(exame.date).toLocaleDateString()}</p>
      <p><strong>Hora:</strong> ${new Date(exame.date).toLocaleTimeString()}</p>
      <p><strong>Médico:</strong> ${exame.nameDoctor}</p>
    `;
    listItem.appendChild(expandedContent);

    title.addEventListener("click", () => {
      expandedContent.classList.toggle("show");
    });

    examsList.appendChild(listItem);
  });
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
});
