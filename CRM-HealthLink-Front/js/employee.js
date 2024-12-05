
// Função para buscar o paciente
async function buscarPaciente(token, emailPaciente) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/employee/paciente/${emailPaciente}`;

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

  const url = `https://crm-healthlink.onrender.com/api/employee/pacientes`;

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

  const url = `https://crm-healthlink.onrender.com/api/employee/create/patient`;

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

  const url = `https://crm-healthlink.onrender.com/api/employee/paciente/${emailPaciente}`;

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
      resultsDiv.innerText = "Erro ao remover paciente.";
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

    const token = localStorage.getItem("token");
    const emailPaciente = document.getElementById(
      "remover-paciente-email"
    ).value;

    await removerPaciente(token, emailPaciente);
  });






//Atualizar paciente
async function atualizarPaciente(token, data) {
  if (!token) {
    ("Usuário não autenticado.");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/employee/paciente`;

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

  const url = `https://crm-healthlink.onrender.com/api/employee/doctor/${emailDoctor}`;

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

  const url = `https://crm-healthlink.onrender.com/api/employee/doctors`;

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
    alert(
      "Token de autenticação não encontrado. Por favor, faça login novamente."
    );
    return;
  }

  const data = document.getElementById("criar-consulta-data").value;
  
 // Obter o valor selecionado do horário (contém tanto horaInicial quanto horaFinal)
 const horarioSelecionado = document.getElementById("criar-consulta-horaInicial").value;
 const medicoId = document.getElementById("criar-consulta-medico").value;
 const pacienteId = document.getElementById("criar-consulta-paciente").value;
 const especialidade = document.getElementById("criar-consulta-especialidade").value;

 // Verificar se todos os campos necessários foram preenchidos
 if (!data || !horarioSelecionado || !medicoId || !pacienteId || !especialidade) {
   alert("Por favor, preencha todos os campos.");
   return;
 }

 // Separar o horário inicial e final do valor selecionado
 const [horaInicial, horaFinal] = horarioSelecionado.split(" - ");

 if (!horaInicial || !horaFinal) {
   alert("Por favor, selecione um horário válido.");
   return;
 }

 const corpoRequisicao = {
   email_patient: pacienteId,
   email_doctor: medicoId,
   date: data,
   inicio: horaInicial.trim(),
   speciality: especialidade,
   fim: horaFinal.trim(),
 };

  const url = `https://crm-healthlink.onrender.com/api/appointment`;

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
      alert("Consulta criada com sucesso.");
    } else {
      // Só tenta ler a resposta como JSON se houver conteúdo
      const text = await response.text();
      if (text) {
        const errorResponse = JSON.parse(text);
        console.error("Detalhes do Erro:", errorResponse);
        alert(
          `Erro ao criar a consulta: ${
            errorResponse.message || "Erro desconhecido"
          }`
        );
      } else {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
    }
  } catch (error) {
    console.error("Erro ao criar a consulta:", error);
    alert("Erro ao criar a consulta. Veja o console para detalhes.");
  }
}





// Função para buscar horários disponíveis da API
async function buscarHorariosDisponiveis(especialidade, data) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return [];
  }

  const url = `https://crm-healthlink.onrender.com/api/calendario/disponibilidades/${encodeURIComponent(data)}/${encodeURIComponent(especialidade)}`;

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

    const disponibilidades = await response.json();
    return disponibilidades;
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error);
    return [];
  }
}

// Função para renderizar os horários no <select>
function renderizarHorariosSelect(horarios) {
  const selectElement = document.getElementById("criar-consulta-horaInicial");

  if (!selectElement) {
    console.error("Elemento <select> não encontrado!");
    return;
  }

  // Limpar as opções anteriores
  selectElement.innerHTML = "";

  // Adicionar uma opção padrão
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Selecione um horário";
  selectElement.appendChild(optionDefault);

  // Adicionar os horários ao <select>
  horarios.forEach((horario) => {
    const option = document.createElement("option");
    // Agora, o value contém tanto a hora inicial quanto a hora final
    option.value = `${horario.homeTime} - ${horario.endTime}`;
    option.textContent = `${horario.homeTime} - ${horario.endTime}`;
    selectElement.appendChild(option);
  });
}





// Função para preencher os horários quando a data ou especialidade forem alteradas
async function preencherHorarios() {
  const data = document.getElementById("criar-consulta-data").value;
  const especialidade = document.getElementById("criar-consulta-especialidade").value;

  // Verificar se a data e especialidade foram selecionadas
  if (!data || !especialidade) {
    return;
  }

  // Buscar os horários disponíveis
  const horariosDisponiveis = await buscarHorariosDisponiveis(especialidade, data);
  renderizarHorariosSelect(horariosDisponiveis);
}

// Adicionar eventos para atualizar os horários ao alterar a data ou especialidade
document.getElementById("criar-consulta-data").addEventListener("change", preencherHorarios);
document.getElementById("criar-consulta-especialidade").addEventListener("change", preencherHorarios);

// Função para preencher o select de horários quando a data ou especialidade for alterada
async function preencherHorarios() {
  const data = document.getElementById("criar-consulta-data").value;
  const especialidade = document.getElementById("criar-consulta-especialidade").value;

  if (!data || !especialidade) {
    return;
  }

  // Buscar e renderizar os horários disponíveis
  const horariosDisponiveis = await buscarHorariosDisponiveis(data, especialidade);
  renderizarHorariosSelect(horariosDisponiveis);
}

// Adicionar eventos para atualizar os horários quando a data ou especialidade mudar
document.getElementById("criar-consulta-data").addEventListener("change", preencherHorarios);
document.getElementById("criar-consulta-especialidade").addEventListener("change", preencherHorarios);





//Listar consultas
async function listarConsultas(token) {
  if (!token) {
    ("Usuário não autenticado.");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/appointment/all`;

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
      '<tr><td colspan="6">Erro ao listar consultas.</td></tr>';
  }
}

// Função para renderizar as consultas na tabela
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
      <td>${consulta.inicio || "Horário não disponível"}</td>
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

  const url = `https://crm-healthlink.onrender.com/api/employee/pacientes`;

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

  const url = `https://crm-healthlink.onrender.com/api/employee/doctors`;

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

  const url = `https://crm-healthlink.onrender.com/api/employee/doctors`;

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






//Preencher select de especialidade
async function preencherSelectEspecialidades(selectId) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/employee/allspecialities`;

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

  especialidades.forEach((especialidade) => {
    const option = document.createElement("option");
    option.value = especialidade; // O valor da especialidade em si, Ñ ESTÁ PEGANDO
    option.textContent = especialidade || "Nome não disponível";
    selectElement.appendChild(option);
  });

}





//Obter Consultas
async function buscarConsulta(event) {
  event.preventDefault(); // Impedir o recarregamento da página

  const token = localStorage.getItem("token");
  const emailPaciente = document.getElementById("obter-consulta-email-paciente").value;
  const emailDoctor = document.getElementById("obter-consulta-email-doctor").value;
  const date = document.getElementById("obter-consulta-data").value;
  const horaInicio = document.getElementById("obter-consulta-hora-inicio").value;

  if (!token || !emailPaciente || !emailDoctor || !date || !horaInicio) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/appointment?emailMedico=${emailDoctor}&emailPaciente=${emailPaciente}&date=${date}&inicio=${horaInicio}:00`; // Inclua horaInicio na URL, se necessário
  
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
    document.getElementById("consulta-results").innerText = "Erro ao buscar consulta.";
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
    `;
  } else {
    resultsDiv.innerText = "Nenhuma consulta encontrada.";
  }
}

document.getElementById("consulta-form").addEventListener("submit", function(event) {
  event.preventDefault(); 
  buscarConsulta(event); 
});





// Função para remover consulta
async function removerConsulta(token, emailPaciente, emailDoctor, dataConsulta, horaInicio) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/appointment`;

  // Corpo da requisição conforme especificado
  const corpoRequisicao = {
    emailPatient: emailPaciente,
    emailDoctor: emailDoctor,
    date: dataConsulta,
    inicio: `${horaInicio}:00` 
  };

  console.log("Corpo da requisição:", JSON.stringify(corpoRequisicao));

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
      console.error(`Erro HTTP! Status: ${response.status}`);
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
      const dataConsulta = document.getElementById("remover-consultaData").value.trim();
      const horaInicio = document.getElementById("remover-consulta-horaInicio").value.trim(); 
      const token = localStorage.getItem("token");

      if (!emailPaciente || !emailDoctor || !dataConsulta || !horaInicio) {
        document.getElementById("consulta-results").innerText = "Por favor, insira todos os dados da consulta.";
        return;
      }

      await removerConsulta(token, emailPaciente, emailDoctor, dataConsulta, horaInicio);
    });
  }
}

setupRemovalEventListeners();




// Função para atualizar uma consulta
async function atualizarConsulta(token, data) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/appointment`;

  // Montando o corpo da requisição conforme o esperado pelo backend
  const requestBody = {
    emailPatient: data["update-consulta-email-paciente"],
    emailDoctor: data["update-consulta-email-doctor"],
    date: data["update-consulta-data"],
    inicio: `${data["update-consulta-hora-inicio"]}:00`, // Adicionando ":00" aos segundos
    fim: `${data["update-consulta-hora-fim"]}:00`,
    speciality: data["update-consulta-especialidade"],
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

    if (!response.ok) {
      const errorText = await response.text(); // Lê o texto da resposta
      throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`);
    }

    alert("Consulta atualizada com sucesso!");
    handleUpdateConsultaResult("success");
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao atualizar consulta.");
    handleUpdateConsultaResult("error");
  }
}

// Função para lidar com o resultado da atualização
async function handleUpdateConsultaResult(status) {
  const resultsDiv = document.getElementById("resultsUpdateConsulta");

  if (!resultsDiv) {
    console.error('Elemento <div id="resultsUpdateConsulta"> não encontrado!');
    return;
  }

  if (status === "success") {
    resultsDiv.innerText = "Consulta atualizada com sucesso!";
    const token = localStorage.getItem("token");
    if (token) {
      await listarConsultas(token); // Atualiza a lista de consultas
    }
  } else if (status === "error") {
    resultsDiv.innerText = "Erro ao atualizar a consulta.";
    resultsDiv.style.color = "red";
    const token = localStorage.getItem("token");
    if (token) {
      await listarConsultas(token); // Tenta atualizar a lista mesmo em caso de erro
    }
  } else {
    resultsDiv.innerText = "Status desconhecido.";
    resultsDiv.style.color = "orange";
  }
}

async function setupUpdateConsultaForm() {
  const form = document.querySelector("#update-consulta-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Previne o refresh da página

      const token = localStorage.getItem("token");

      const data = {
        "update-consulta-email-paciente": document.getElementById("update-consulta-email-paciente").value.trim(),
        "update-consulta-email-doctor": document.getElementById("update-consulta-email-doctor").value.trim(),
        "update-consulta-data": document.getElementById("update-consulta-data").value,
        "update-consulta-hora-inicio": document.getElementById("update-consulta-hora-inicio").value,
        "update-consulta-hora-fim": document.getElementById("update-consulta-hora-fim").value,
        "update-consulta-especialidade": document.getElementById("update-consulta-especialidade").value,
      };

      if (
        !data["update-consulta-email-paciente"] ||
        !data["update-consulta-email-doctor"] ||
        !data["update-consulta-data"] ||
        !data["update-consulta-hora-inicio"] ||
        !data["update-consulta-hora-fim"] ||
        !data["update-consulta-especialidade"]
      ) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      await atualizarConsulta(token, data);
    });
  } else {
    console.error("Formulário de atualização de consulta não encontrado!");
  }
}

// Chamar a função para configurar o evento do formulário ao carregar a página
setupUpdateConsultaForm();




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
    window.location.href = "/pages/login.html"; 
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
