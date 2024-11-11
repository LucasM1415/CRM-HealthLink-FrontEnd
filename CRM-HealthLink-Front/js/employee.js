const ip = "localhost";

// Função para buscar o paciente
async function buscarPaciente(token, emailPaciente) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/employee/paciente/${emailPaciente}`;

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
    renderPaciente(data);
  } catch (error) {
    console.error("Erro na requisição:", error);
    document.getElementById("resultsGet").innerText =
      "Erro ao buscar paciente.";
  }
}

// Função para renderizar os dados do paciente
function renderPaciente(data) {
  const resultsDiv = document.getElementById("resultsGet");
  resultsDiv.innerHTML = "";

  if (data) {
    resultsDiv.innerHTML = `
      <p><strong>Nome:</strong> ${data.name || "Nome não disponível"}</p>
      <p><strong>Data de nascimento:</strong> ${
        data.birthDate
          ? new Date(data.birthDate).toLocaleDateString()
          : "Data de Nascimento não disponível"
      }</p>
      <p><strong>Email:</strong> ${data.email || "Email não disponível"}</p>
    `;
  } else {
    resultsDiv.innerText = "Nenhum paciente encontrado.";
  }
}

// Adiciona evento de submit ao formulário
document
  .getElementById("paciente-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token"); // Substitua por um método que recupere o token dinamicamente
    const emailPaciente = document
      .getElementById("obter-paciente-email")
      .value.trim();

    // Verifique se o email está definido e não está vazio
    if (!emailPaciente) {
      alert("Por favor, insira um email válido.");
      return;
    }

    await buscarPaciente(token, emailPaciente);
  });

//Listar paciente
async function listarPacientes(token) {
  if (!token) {
    ("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/employee/pacientes`;

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
    renderPacientes(data);
  } catch (error) {
    console.error("Erro na requisição:", error);
    const resultsTable = document.querySelector("table tbody");
    resultsTable.innerHTML =
      '<tr><td colspan="5">Erro ao listar pacientes.</td></tr>';
  }
}

function renderPacientes(data) {
  const resultsTable = document.querySelector("table tbody");

  if (!resultsTable) {
    // console.error('Elemento com ID "table tbody" não encontrado.'); "[tbody] Deste render está no listPatientManagerPage.html"
    return;
  }

  resultsTable.innerHTML = "";

  if (!Array.isArray(data)) {
    console.error("Os dados fornecidos não são uma lista de pacientes.");
    return;
  }

  data.forEach((paciente) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${paciente.name || "Nome não disponível"}</td>
        <td>${
          paciente.birthDate
            ? new Date(paciente.birthDate).toLocaleDateString()
            : "Data de Nascimento não disponível"
        }</td>
        <td>${paciente.email || "Email não disponível"}</td>
      `;

    resultsTable.appendChild(row);
  });
}

//criar paciente
async function criarPaciente(token, data) {
  if (!token) {
    ("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/employee/create/patient`;

  const requestBody = {
    name: data["criar-paciente-nome"],
    birthDate: data["criar-paciente-data-nascimento"],
    cpf: data["criar-paciente-cpf"],
    email: data["criar-paciente-email"],
    password: data["criar-paciente-password"],
    acessLevel: "PATIENT",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Lê o texto da resposta
      throw new Error(
        `Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`
      );
    }

    // Verifica se a resposta possui conteúdo
    const responseData = await response.text(); // Usa text() para evitar erro de JSON
    if (responseData) {
      const jsonData = JSON.parse(responseData); // Analisa o JSON
      handleCreationResult("success");
    } else {
      handleCreationResult("success"); // Caso a resposta esteja vazia
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    handleCreationResult("error");
  }
}

// Função para lidar com o resultado da criação
async function handleCreationResult(status) {
  const resultsDiv = document.getElementById("resultsCreate");
  const token = localStorage.getItem("token");

  switch (status) {
    case "success":
      resultsDiv.innerText = "Paciente criado com sucesso!";
      if (token) {
        await listarPacientes(token);
      }
      break;

    case "error":
      if (token) {
        await listarPacientes(token);
        await preencherSelectPacientes();
        await listarHorarios(token);
      }
      break;

    default:
      resultsDiv.innerText = "Status desconhecido.";
      break;
  }
}

async function setupPacienteForm() {
  const form = document.getElementById("criar-paciente-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const token = localStorage.getItem("token");
      const data = {
        "criar-paciente-nome": document.getElementById("criar-paciente-nome")
          .value,
        "criar-paciente-data-nascimento": document.getElementById(
          "criar-paciente-data-nascimento"
        ).value,
        "criar-paciente-cpf":
          document.getElementById("criar-paciente-cpf").value,
        "criar-paciente-email": document.getElementById("criar-paciente-email")
          .value,
        "criar-paciente-password": document.getElementById(
          "criar-paciente-password"
        ).value,
      };

      await criarPaciente(token, data);
    });
  }
}

// Remover paciente
async function removerPaciente(token, emailPaciente) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/employee/paciente/${emailPaciente}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("Erro ao remover paciente:", response.statusText);
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    handleRemovalResult("success", token); // Passa o token para a função de resultado
  } catch (error) {
    console.error("Erro na requisição:", error);
    handleRemovalResult("error", token); // Passa o token para a função de erro
  }
}

// Função para lidar com o resultado da remoção
async function handleRemovalResult(status, token) {
  const resultsDiv = document.getElementById("resultsDelete");

  switch (status) {
    case "success":
      resultsDiv.innerText = "Paciente removido com sucesso!";

      if (token) {
        await listarPacientes(token); // Atualiza a lista de pacientes
      }
      break;

    case "error":
      if (token) {
        await listarPacientes(token); // Atualiza a lista de pacientes
        await listarConsultas(token);
        await preencherSelectPacientes();
      }
      break;

    default:
      resultsDiv.innerText = "Status desconhecido.";
      break;
  }
}

// Adiciona evento de submit ao formulário de remoção
document
  .getElementById("remover-paciente-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const emailPaciente = document.getElementById(
      "remover-paciente-email"
    ).value;

    await removerPaciente(token, emailPaciente);
  });

// async function configureConsultaRemovalListeners() {
//   const form = document.getElementById("remover-consulta-form");

//   if (form) {
//     form.addEventListener("submit", async (event) => {
//       event.preventDefault();

//       const consultaId = document
//         .getElementById("remover-consulta-id")
//         .value.trim();
//       const token = localStorage.getItem("token");

//       if (consultaId === "") {
//         document.getElementById("consulta-results").innerText =
//           "Por favor, insira o ID da consulta.";
//         return;
//       }

//       await removerConsulta(token);
//     });
//   }
// }

//Atualizar paciente
async function atualizarPaciente(token, data) {
  if (!token) {
    ("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/employee/paciente`;

  const requestBody = {
    name: data["update-paciente-nome"],
    birthDate: data["update-paciente-data-nascimento"],
    cpf: data["update-paciente-cpf"],
    email: data["update-paciente-email"],
    password: data["update-paciente-password"],
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    const responseData = responseText ? JSON.parse(responseText) : {};
    handleUpdateResult("success");
  } catch (error) {
    console.error("Erro na requisição:", error);
    handleUpdateResult("error");
  }
}

async function handleUpdateResult(status) {
  const resultsDiv = document.getElementById("resultsUpdate");

  if (!resultsDiv) {
    console.error('Elemento <div id="resultsUpdate"> não encontrado!');
    return;
  }

  if (status === "success") {
    const token = localStorage.getItem("token");
    if (token) {
      await listarPacientes(token);
    }
  } else if (status === "error") {
    const token = localStorage.getItem("token");
    if (token) {
      await listarPacientes(token);
      await preencherSelectPacientes();
    }
  } else {
    resultsDiv.innerHTML = "<p>Estado desconhecido.</p>";
    resultsDiv.style.color = "orange";
  }
}

//Obter médico
async function buscarMedico(token, emailDoctor) {
  if (!token) {
    return;
  }

  const url = `http://${ip}:8080/api/employee/doctor/${emailDoctor}`;

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
    renderMedico(data);
  } catch (error) {
    console.error("Erro na requisição:", error);
    document.getElementById("medico-results").innerText =
      "Erro ao buscar médico.";
  }
}

function renderMedico(data) {
  const resultsDiv = document.getElementById("medico-results");
  resultsDiv.innerHTML = "";

  if (data) {
    resultsDiv.innerHTML = `
      <p><strong>Nome:</strong> ${data.name}</p>
      <p><strong>Data de Nascimento:</strong> ${data.birthDate}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>CRM:</strong> ${data.crm}</p>
      <p><strong>Especialidade:</strong> ${data.speciality}</p>
    `;
  } else {
    resultsDiv.innerText = "Nenhum médico encontrado.";
  }
}

//listar medicos
async function listarMedicos(token) {
  if (!token) {
    return;
  }

  const url = `http://${ip}:8080/api/employee/doctors`;

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
    renderMedicos(data);
  } catch (error) {
    console.error("Erro na requisição:", error);
    const resultsTable = document.querySelector("#list-medicos-tbody");
    resultsTable.innerHTML =
      '<tr><td colspan="7">Erro ao listar médicos.</td></tr>';
  }
}

function renderMedicos(medicos) {
  const tbody = document.querySelector("#list-medicos-tbody");

  if (!tbody) {
    // console.error("Elemento <tbody> não encontrado!"); "[tbody] Deste render está no listDoctorManagerPage.html"
    return;
  }

  tbody.innerHTML = "";

  medicos.forEach((medico) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${medico.name || "Nome não disponível"}</td>
          <td>${medico.birthDate || "Data não disponível"}</td>
          <td>${medico.email || "Email não disponível"}</td>
          <td>${medico.crm || "CRM não disponível"}</td>
          <td>${medico.speciality || "Especialização não disponível"}</td>
      `;
    tbody.appendChild(row);
  });
}

//Criar consulta
async function criarNovaConsulta() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Token de autenticação não encontrado. Por favor, faça login novamente.");
    return;
  }

  const data = document.getElementById("criar-consulta-data").value;
  const horaInicial = document.getElementById("criar-consulta-horaInicial").value;
  const horaFinal = document.getElementById("criar-consulta-horaFinal").value;
  const medicoId = document.getElementById("criar-consulta-medico").value;
  const pacienteId = document.getElementById("criar-consulta-paciente").value;
  const especialidade = document.getElementById("criar-consulta-especialidade").value;

  if (!data || !horaInicial || !horaFinal || !medicoId || !pacienteId || !especialidade) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const corpoRequisicao = {
    email_patient: pacienteId,
    email_doctor: medicoId,
    date: data,
    inicio: `${horaInicial}:00`,
    speciality: especialidade,
    fim: `${horaFinal}:00`,
  };

  const url = `http://${ip}:8080/api/appointment`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(corpoRequisicao),
    });

    if (response.status === 201) {
      console.log("Consulta criada com sucesso.");
      alert("Consulta criada com sucesso.");
    } else {
      // Só tenta ler a resposta como JSON se houver conteúdo
      const text = await response.text();
      if (text) {
        const errorResponse = JSON.parse(text);
        console.error("Detalhes do Erro:", errorResponse);
        alert(`Erro ao criar a consulta: ${errorResponse.message || "Erro desconhecido"}`);
      } else {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
    }
  } catch (error) {
    console.error("Erro ao criar a consulta:", error);
    alert("Erro ao criar a consulta. Veja o console para detalhes.");
  }
}


//Listar consultas
async function listarConsultas(token) {
  if (!token) {
    ("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/appointment/all`;

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
    renderConsultas(data);
  } catch (error) {
    console.error("Erro na requisição:", error);
    const resultsTable = document.querySelector("#list-consultas-tbody");
    resultsTable.innerHTML =
      '<tr><td colspan="3">Erro ao listar consultas.</td></tr>';
  }
}

function renderConsultas(consultas) {
  const tableBody = document.querySelector("#list-consultas-tbody");

  if (!tableBody) {
    // console.error("Elemento <tbody> não encontrado!"); >> "[tbody] Deste render está no listAppointmentManagerPage.html"
    return;
  }

  tableBody.innerHTML = "";

  
  
  consultas.forEach((consulta) => {
    const row = document.createElement("tr");
    
    row.innerHTML = `
    <td>${consulta.date || "Data não disponível"}</td>
    <td>${consulta.namePatient || "Paciente não disponível"}</td>
    <td>${consulta.nameDoctor || "Médico não disponível"}</td>
    `;

    tableBody.appendChild(row);
  });
}

async function preencherSelectPacientes() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return;
  }

  const url = `http://${ip}:8080/api/employee/pacientes`;

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

    const pacientes = await response.json();
    renderPacientesSelect(pacientes);
  } catch (error) {
    console.error("Erro ao preencher o select com pacientes:", error);
  }
}

function renderPacientesSelect(pacientes) {
  const selectElement = document.getElementById("criar-consulta-paciente");

  if (!selectElement) {
    console.error("Elemento <select> não encontrado!");
    return;
  }

  selectElement.innerHTML = "";

  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Selecione um paciente";
  selectElement.appendChild(optionDefault);

  pacientes.forEach((paciente) => {
    const option = document.createElement("option");
    option.value = paciente.email;
    option.textContent = paciente.name || "Nome não disponível";
    selectElement.appendChild(option);
  });
}

async function preencherSelectMedicos() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return;
  }

  const url = `http://${ip}:8080/api/employee/doctors`;

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

    const medicos = await response.json();
    renderMedicosSelect(medicos);
  } catch (error) {
    console.error("Erro ao preencher o select com médicos:", error);
  }
}

async function preencherSelectMedicos() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return;
  }

  const url = `http://${ip}:8080/api/employee/doctors`;

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

    const medicos = await response.json();
    renderMedicosSelect(medicos);
  } catch (error) {
    console.error("Erro ao preencher o select com médicos:", error);
  }
}

function renderMedicosSelect(medicos) {
  const selectElement = document.getElementById("criar-consulta-medico");

  if (!selectElement) {
    console.error("Elemento <select> não encontrado!");
    return;
  }

  selectElement.innerHTML = "";

  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Selecione um médico";
  selectElement.appendChild(optionDefault);

  medicos.forEach((medico) => {
    const option = document.createElement("option");
    option.value = medico.email;
    option.textContent = medico.name || "Nome não disponível";
    selectElement.appendChild(option);
  });
}

//Obter Consultas
async function buscarConsulta(event) {
  event.preventDefault(); //Impedir o recarregamento da página

  const token = localStorage.getItem("token");
  const emailPaciente = document.getElementById("obter-consulta-email-paciente").value;
  const emailDoctor = document.getElementById("obter-consulta-email-doctor").value;
  const date = document.getElementById("obter-consulta-data").value;
  const horaInicio = document.getElementById("obter-consulta-horaInicio").value;

  if (!token || !emailPaciente || !emailDoctor || !date || !horaInicio) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const url = `http://${ip}:8080/api/appointment?emailPatient=${encodeURIComponent(emailPaciente)}&emailDoctor=${encodeURIComponent(emailDoctor)}&date=${encodeURIComponent(date)}`;
  console.log("URL da requisição:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Erro HTTP! Status: ${response.status}`);
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const data = await response.json();
    renderConsulta(data);
  } catch (error) {
    console.error("Erro na requisição:", error);
    document.getElementById("consulta-results").innerText =
      "Erro ao buscar consulta.";
  }
}

function renderConsulta(data) {
  const resultsDiv = document.getElementById("consulta-results");
  resultsDiv.innerHTML = "";

  if (data) {
    resultsDiv.innerHTML = `
      <p><strong>Paciente:</strong> ${data.namePatient}</p>
      <p><strong>Médico:</strong> ${data.nameDoctor}</p>
      <p><strong>Data:</strong> ${data.date}</p>
      <p><strong>Descrição:</strong> ${data.description}</p>

    `;
  } else {
    resultsDiv.innerText = "Nenhuma consulta encontrada.";
  }
}
// Adicionar o evento de submit ao formulário
document
  .getElementById("consulta-form")
  .addEventListener("submit", buscarConsulta);




// Função para remover consulta
async function removerConsulta(token, emailPaciente, emailDoctor, dataConsulta) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/appointment`;

  // Corpo da requisição conforme especificado
  const corpoRequisicao = {
    emailPatient: emailPaciente,
    emailDoctor: emailDoctor,
    date: dataConsulta,
  };

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(corpoRequisicao),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    await handleRemovalResult("success", token); // Passa o token para a função de resultado
  } catch (error) {
    console.error("Erro na requisição:", error);
    await handleRemovalResult("error", token); // Passa o token para a função de erro
  }
}

// Função para lidar com o resultado da remoção
async function handleRemovalResult(status, token) {
  const resultsDiv = document.getElementById("consulta-results");

  switch (status) {
    case "success":
      resultsDiv.innerText = "Consulta removida com sucesso!";
      if (token) {
        await listarConsultas(token); // Atualiza a lista de consultas
      }
      break;

    case "error":
      resultsDiv.innerText = "Erro ao remover a consulta.";
      if (token) {
        await listarConsultas(token); // Tenta atualizar a lista em caso de erro
      }
      break;

    default:
      resultsDiv.innerText = "Status desconhecido.";
      break;
  }
}

// Função para configurar o evento de remoção de consulta
async function setupRemovalEventListeners() {
  const form = document.getElementById("remover-consulta-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const emailPaciente = document.getElementById("remover-consulta-email-paciente").value.trim();
      const emailDoctor = document.getElementById("remover-consulta-email-doctor").value.trim();
      const dataConsulta = document.getElementById("remover-consulta-data").value.trim();
      const token = localStorage.getItem("token");

      if (!emailPaciente || !emailDoctor || !dataConsulta) {
        document.getElementById("consulta-results").innerText =
          "Por favor, insira os dados da consulta.";
        return;
      }

      await removerConsulta(token, emailPaciente, emailDoctor, dataConsulta);
    });
  }
}

setupRemovalEventListeners();

function tokenValidation() {
  var token = localStorage.getItem("token");
  var userid = localStorage.getItem("id");
  if (token == null) {
    window.location.href = "../index.html";
  } else {
    listarPacientes(token, userid);
    listarMedicos(token, userid);
    listarConsultas(token, userid);
  }
}

tokenValidation();

function singOut() {
  if (typeof localStorage !== "undefined") {
    localStorage.clear();
    ("Você foi desconectado com sucesso.");
    window.location.href = "../pages/login.html";
  } else {
    console.error("Local storage não está disponível.");
  }
}

function updateUserName() {
  const userName = localStorage.getItem("userName");
  const welcomeMessage = document.getElementById("welcome-message");
  if (userName) {
    welcomeMessage.textContent = `Bem-vindo(a), ${userName}`;
  } else {
    welcomeMessage.textContent = "Bem-vindo(a), Usuário";
  }
}

async function setupEventListeners() {
  await setupRemovalEventListeners();
  const form = document.getElementById("paciente-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const token = localStorage.getItem("token");
      const pacienteEmail = document.getElementById("paciente-form").value;

      await buscarPaciente(token, pacienteEmail);
    });
  }

  const backButton = document.getElementById("back-button");

  if (backButton) {
    backButton.addEventListener("click", () => {
      singOut();
    });
  }
  const token = localStorage.getItem("token");
  if (token) {
    try {
      await listarPacientes(token);
      await preencherSelectPacientes();
      await preencherSelectMedicos();
      await listarMedicos(token);
      await listarConsultas(token);
    } catch (error) {
      console.error("Erro ao preencher o select com pacientes:", error);
    }
  }

  const updateForm = document.getElementById("update-paciente-form");
  if (updateForm) {
    updateForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const token = localStorage.getItem("token");
      const formData = new FormData(updateForm);

      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      await atualizarPaciente(token, data);
    });
  }

  const medicoForm = document.getElementById("medico-form");
  if (medicoForm) {
    medicoForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const token = localStorage.getItem("token");
      const medicoId = document.getElementById("obter-doutor-id").value;

      await buscarMedico(token, medicoId);
    });
  }
}

const consultaForm = document.getElementById("consulta-form");
if (consultaForm) {
  consultaForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const consultaId = document.getElementById("obter-consulta-data").value;
    await buscarConsulta(token, consultaId);
  });
}

const formCriarConsulta = document.getElementById("form-criar-consulta");
if (formCriarConsulta) {
  formCriarConsulta.addEventListener("submit", async (event) => {
    event.preventDefault();
    await criarNovaConsulta();
    await listarConsultas();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  updateUserName();
  setupPacienteForm();
  preencherSelectPacientes();
});
