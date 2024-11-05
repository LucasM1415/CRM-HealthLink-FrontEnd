// Criar um Médico
async function criarMedico(token, data) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/employee/doctor`;

  const requestBody = {
    name: data["criar-doutor-nome"],
    birthDate: data["criar-doutor-data-nascimento"],
    cpf: data["criar-doutor-cpf"],
    crm: data["criar-doutor-crm"],
    speciality: [data["criar-doutor-speciality"]],
    email: data["criar-doutor-email"],
    password: data["criar-doutor-password"],
    accessLevel: "DOCTOR",
  };

  console.log("Dados enviados:", requestBody);

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
      throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`);
    }

    const responseData = await response.json();
    if (responseData) {
      //const jsonData = JSON.parse(responseData);
      handleCreationResult("success");
    } else {
      handleCreationResult("success");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    handleCreationResult("error");
  }
}

//Funcção pra lidar com a criar do Médico
async function handleCreationResult(status) {
  const resultsDivs = document.getElementById("resultsCreateDoctor");
  const token = localStorage.getItem("token");

  switch (status) {
    case "success":
      resultsDivs.innerText = "Médico criado com sucesso!";
      if (token) {
        await listarMedicos(token);
      }
      break;

    case "error":
      if (token) {
        await listarMedicos(token);
        await listarPacientes(token);
        await preencherSelectPacientes();
      }
      break;

    default:
      resultsDivs.innerText = "Status desconhecido.";
      break;
  }
}

async function setupDoctorForm() {
  const form = document.getElementById("criar-doutor-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const token = localStorage.getItem("token");
      const data = {
        "criar-doutor-nome": document.getElementById("criar-doutor-nome").value,
        "criar-doutor-data-nascimento": document.getElementById("criar-doutor-data-nascimento").value,
        "criar-doutor-cpf": document.getElementById("criar-doutor-cpf").value,
        "criar-doutor-crm": document.getElementById("criar-doutor-crm").value,
        "criar-doutor-speciality": document.getElementById("criar-doutor-speciality").value,
        "criar-doutor-email": document.getElementById("criar-doutor-email").value,
        "criar-doutor-password": document.getElementById("criar-doutor-password").value,
      };

      await criarMedico(token, data);
    });
  }
}




//Atualizar um Médico pelo E-Mail
async function atualizarMedico(token, data) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/employee/doctor`;


  const requestBody = {
    name: data["update-doutor-nome"],
    birthDate: data["update-doutor-data-nascimento"],
    cpf: data["update-doutor-cpf"],
    crm: data["update-doutor-crm"],
    speciality: [data["update-doutor-speciality"]],
    accessLevel: "DOCTOR",
    email: data["update-doutor-email"],
    password: data["update-doutor-password"],
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

    alert("Médico atualizado com sucesso!");
    handleUpdateDoctorResult("success");
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao atualizar médico.");
    handleUpdateDoctorResult("error");
  }
}

async function handleUpdateDoctorResult(status) {
  const resultsDiv = document.getElementById("resultsUpdateDoctor");

  if (!resultsDiv) {
    console.error('Elemento <div id="resultsUpdate"> não encontrado!');
    return;
  }

  if (status === "success") {
    const token = localStorage.getItem("token");
    if (token) {
      await listarMedicos(token);
    }
  } else if (status === "error") {
    const token = localStorage.getItem("token");
    if (token) {
      await listarMedicos(token);
      await preencherSelectEspecialidades("update-doutor-speciality");
    }
  } else {
    resultsDiv.innerHTML = "<p>Estado desconhecido.</p>";
    resultsDiv.style.color = "orange";
  }
}

async function setupUpdateDoctorForm() {
  const form = document.getElementById("update-doutor-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Previne o refresh da página

      const token = localStorage.getItem("token");
      const data = {
        "update-doutor-email": document.getElementById("update-doutor-email").value,
        "update-doutor-nome": document.getElementById("update-doutor-nome").value,
        "update-doutor-data-nascimento": document.getElementById("update-doutor-data-nascimento").value,
        "update-doutor-cpf": document.getElementById("update-doutor-cpf").value,
        "update-doutor-crm": document.getElementById("update-doutor-crm").value,
        "update-doutor-speciality": document.getElementById("update-doutor-speciality").value,
        "update-doutor-password": document.getElementById("update-doutor-password").value,
      };

      await atualizarMedico(token, data);
    });
  } else {
    console.error("Formulário de atualização de médico não encontrado!");
  }
}





//Criar um Funcionário
async function criarFuncionario(token, data) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/employee/create/employee`;

  const requestBody = {
    name: data["criar-funcionario-nome"],
    birthDate: data["criar-funcionario-data-nascimento"],
    cpf: data["criar-funcionario-cpf"],
    office: data["criar-funcionario-cargo"],
    accessLevel: data["criar-funcionario-nivel-acesso"],
    email: data["criar-funcionario-email"],
    password: data["criar-funcionario-password"],
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
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    alert("Funcionário criado com sucesso!");
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao criar funcionário.");
  }
}




//Obter um Funcionário
async function obterFuncionario(token, emailFuncionario) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/employee/${emailFuncionario}`;

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

    document.getElementById("funcionario-nome").textContent = data.name;
    document.getElementById("funcionario-data-nascimento").textContent = data.birthDate;
    document.getElementById("funcionario-email").textContent = data.email;
    document.getElementById("funcionario-nivel-acesso").textContent = data.acessLevel;
    document.getElementById("funcionario-cargo").textContent = data.office;

  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao obter funcionário.");
  }
}




//Atualizar um Funcionário
async function atualizarFuncionario(token, funcionarioId, data) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/employee`;

  const requestBody = {
    name: data["update-funcionario-nome"],
    birthDate: data["update-funcionario-data-nascimento"],
    cpf: data["update-funcionario-cpf"],
    email: data["update-funcionario-email"],
    password: data['update-funcionario-password'],
    accessLevel: data["update-funcionario-nivel-acesso"]
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
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    alert("Funcionário atualizado com sucesso!");
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao atualizar funcionário.");
  }
}



//Listar todos os Funcionários
async function listarFuncionarios(token) {
  if (!token) {
    alert('Usuário não autenticado.');
    return;
  }

  const url = `http://${ip}:8080/api/employee`; 

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
    renderFuncionarios(data);

  } catch (error) {
    console.error('Erro na requisição:', error);
    const resultsTable = document.querySelector('#list-employee-tbody');
    resultsTable.innerHTML = '<tr><td colspan="5">Erro ao listar funcionários.</td></tr>';
  }
}

function renderFuncionarios(data) {
  const resultsTable = document.querySelector('#list-employee-tbody');
  
  if (!resultsTable) {
    console.error('Elemento com ID "list-employee-tbody" não encontrado.');
    return;
  }
  
  resultsTable.innerHTML = '';

  if (!Array.isArray(data)) {
    console.error('Os dados fornecidos não são uma lista de funcionários.');
    return;
  }

  data.forEach(funcionario => {
    const row = document.createElement('tr');
 
    row.innerHTML = `
      <td>${funcionario.name || 'Nome não disponível'}</td>
      <td>${funcionario.birthDate ? new Date(funcionario.birthDate).toLocaleDateString() : 'Data de Nascimento não disponível'}</td>
      <td>${funcionario.email || 'Email não disponível'}</td>
      <td>${funcionario.office || 'Cargo não disponível'}</td>
    `;
  
    console.log(funcionario.name);
    console.log(funcionario.birthDate);
    console.log(funcionario.email);
    console.log(funcionario.office);


    resultsTable.appendChild(row);
  });
}


async function setupRemovalEventListeners() {
  const form = document.getElementById("remover-paciente-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Evita o envio padrão do formulário

      const pacienteId = document
        .getElementById("remover-paciente-id")
        .value.trim(); // Obtém o ID do paciente
      const token = localStorage.getItem("token"); // Obtém o token do armazenamento local

      if (pacienteId === "") {
        document.getElementById("results").innerText =
          "Por favor, insira o ID do paciente.";
        return;
      }

      await removerPaciente(token, pacienteId);
    });
  }
}




//Preencher select de especialidade
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





//Criar horário
async function criarHorarios() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return;
  }

  const date = document.getElementById("calendar").value;
  const specialization = document
    .getElementById("specialization")
    .value.toUpperCase();

  // Validar os campos
  if (!date || !specialization) {
    console.error("Data ou especialidade não selecionada");
    return;
  }

  const turnosSelecionados = Array.from(
    document.querySelectorAll('input[name="turnos"]:checked')
  );
  if (turnosSelecionados.length === 0) {
    console.error("Nenhum turno selecionado");
    return;
  }

  const url = `http://${ip}:8080/api/calendario/savaList`;

  const horarios = turnosSelecionados.map((turno) => {
    const [startHour, startMinute] = turno.dataset.horarioInicio
      .split(":")
      .map(Number);
    const [endHour, endMinute] = turno.dataset.horarioFim
      .split(":")
      .map(Number);

    const formattedStartHour = String(startHour).padStart(2, "0");
    const formattedStartMinute = String(startMinute).padStart(2, "0");
    const formattedEndHour = String(endHour).padStart(2, "0");
    const formattedEndMinute = String(endMinute).padStart(2, "0");

    return {
      date,
      homeTime: `${formattedStartHour}:${formattedStartMinute}:00`,
      endTime: `${formattedEndHour}:${formattedEndMinute}:00`,
      specialityType: specialization, // Verifique aqui se é specialityType
    };
  });

  // Log dos dados que serão enviados
  console.log("Dados enviados:", JSON.stringify(horarios, null, 2));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(horarios),
    });

    const responseText = await response.text(); // Captura texto da resposta
    if (!response.ok) {
      console.error("Erro ao criar os horários:", responseText); // Mostra mensagem de erro
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Horários criados com sucesso:", result);
  } catch (error) {
    console.error("Erro ao criar os horários:", error);
  }
}




//Listar horários
async function listarHorarios() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.error("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/calendario`; 

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
    renderizarHorarios(data);
  } catch (error) {
    console.error("Erro na requisição:", error);
    const resultsTable = document.getElementById("list-horarios-tbody");
    resultsTable.innerHTML =
      '<tr><td colspan="4">Erro ao listar horários.</td></tr>';
  }
}

function renderizarHorarios(data) {
  const resultsTable = document.getElementById("list-horarios-tbody");

  if (!resultsTable) {
    console.error("Elemento da tabela não encontrado.");
    return;
  }

  resultsTable.innerHTML = "";

  if (!Array.isArray(data)) {
    console.error("Os dados fornecidos não são uma lista de horários.");
    return;
  }

  data.forEach((horario) => {
    const row = document.createElement("tr");

    row.innerHTML = `
          <td>${horario.date || "Data não disponível"}</td>
          <td>${horario.homeTime || "Hora de início não disponível"}</td>
          <td>${horario.endTime || "Hora de término não disponível"}</td>
          <td>${horario.specialityType || "Especialidade não disponível"}</td>
      `;

    resultsTable.appendChild(row);
  });
}




//Listar resultado da pesquisa
async function pesquisarHorarios() {
  const token = localStorage.getItem("token");
  const speciality = document.getElementById("specialization-search").value;
  const month = document.getElementById("month-search").value;
  const year = document.getElementById("year-search").value;

  if (!token || !speciality || !month || !year) {
    console.error("Dados insuficientes para realizar a pesquisa");
    return;
  }

  const url = `http://${ip}:8080/api/calendario/specialty?speciality=${speciality}&month=${month}&year=${year}`;

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
    console.log("Dados recebidos da pesquisa:", data); // Verifica a estrutura dos dados

    renderizarHorariosPesquisa(data); // Chama a função para renderizar os horários de pesquisa

    // Exibir a tabela após a pesquisa
    document.getElementById("search-results").style.display = "block"; // Exibe a tabela correta
  } catch (error) {
    console.error("Erro ao pesquisar horários:", error);
  }
}

function renderizarHorariosPesquisa(data) {
  const resultsTable = document.getElementById("search-results-tbody"); // Corrigido para o ID correto

  if (!resultsTable) {
    console.error("Elemento de tabela não encontrado.");
    return;
  }

  resultsTable.innerHTML = ""; // Limpa a tabela antes de adicionar novos resultados

  if (!Array.isArray(data)) {
    console.error("Os dados fornecidos não são uma lista de horários.");
    return;
  }

  data.forEach((horario) => {
    const row = document.createElement("tr");

    row.innerHTML = `
          <td>${
            horario.date
              ? new Date(horario.date).toLocaleDateString()
              : "Data não disponível"
          }</td>
          <td>${horario.homeTime || "Horário de Início não disponível"}</td>
          <td>${horario.endTime || "Horário de Fim não disponível"}</td>
          <td>${horario.specialityType || "Especialidade não disponível"}</td>
      `;

    resultsTable.appendChild(row);
  });
}
//Preencher o select de médicos de emergência
async function preencherSelectMedicosEmergencia() {
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
      renderMedicosSelectEmergencia(medicos); // Chama a função de renderização
  } catch (error) {
      console.error("Erro ao preencher o select com médicos:", error);
  }
}

function renderMedicosSelectEmergencia(medicos) {
  const selectElement = document.getElementById("criar-consulta-medico-emergencia"); // Use o ID específico para emergência
  console.log("Médicos recebidos:", medicos);

  if (!selectElement) {
      console.error("Elemento <select> não encontrado!");
      return;
  }

  selectElement.innerHTML = ""; // Limpa as opções existentes

  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Selecione um médico";
  selectElement.appendChild(optionDefault);

  medicos.forEach((medico) => {
      const option = document.createElement("option");
      option.value = medico.email; // Use o id do médico
      option.textContent = medico.name || "Nome não disponível";
      selectElement.appendChild(option);
  });
}

// Lista para armazenar os médicos selecionados
let medicosAdicionados = []; // Lista de médicos adicionados

async function adicionarMedico() {
    const selectElement = document.getElementById("criar-consulta-medico-emergencia");
    const medicoEmail = selectElement.value; // E-mail do médico selecionado
    const medicoNome = selectElement.options[selectElement.selectedIndex].text; // Nome do médico selecionado

    // Verifica se um médico foi selecionado
    if (!medicoEmail) {
        alert("Por favor, selecione um médico.");
        return;
    }

    // Verifica se o médico já foi adicionado
    if (medicosAdicionados.some(medico => medico.email === medicoEmail)) {
        alert("Este médico já está na lista.");
        return;
    }

    // Adiciona o médico à lista
    medicosAdicionados.push({ email: medicoEmail, nome: medicoNome });

    // Atualiza a exibição da lista de médicos
    atualizarListaMedicos();
}

function atualizarListaMedicos() {
    const listaMedicosElement = document.getElementById("medicos-adicionados");
    listaMedicosElement.innerHTML = ""; // Limpa a lista atual

    medicosAdicionados.forEach(medico => {
        const listItem = document.createElement("li");
        listItem.textContent = `${medico.nome} (${medico.email})`; // Exibe nome e e-mail
        listaMedicosElement.appendChild(listItem);
    });
}







function tokenValidation() {
  var token = localStorage.getItem("token");
  var userid = localStorage.getItem("id");
  
  if (!token) {
    window.location.href = "../index.html";
    return null; // Retorna null se não houver token
  }
  
  return { token, userid }; // Retorna um objeto com token e userid
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
  const userName = localStorage.getItem("userName");
  const welcomeMessage = document.getElementById("welcome-message");
  if (userName) {
    welcomeMessage.textContent = `Bem-vindo(a), ${userName}`;
  } else {
    welcomeMessage.textContent = "Bem-vindo(a), Usuário";
  }
}




async function setupEventListeners2() {
  await setupRemovalEventListeners();
  // Configuração do formulário de horário
  const horarioForm = document.getElementById("configurar-horario-form");
  const salvarButton = document.getElementById("salvar-horario-button");

  if (horarioForm && salvarButton) {
    salvarButton.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("Salvar horário clicado"); // Para verificar
      await criarHorarios(); // Chamando a função
    });
  } else {
    console.error("Formulário ou botão não encontrado");
  }

  // Opções de visualização
  const visualizacaoOptions = document.querySelectorAll(
    'input[name="visualizacao"]'
  );
  const searchSection = document.getElementById("search-section");
  const listaHorarios = document.getElementById("lista-horarios");
  const searchResults = document.getElementById("search-results");

  // Verifica a opção de visualização selecionada
  const selectedOption = document.querySelector(
    'input[name="visualizacao"]:checked'
  );
  if (selectedOption && selectedOption.value === "todos") {
    listaHorarios.style.display = "block";
    searchResults.style.display = "none"; // Esconde resultados de pesquisa
    await listarHorarios(); // Chama a função para listar horários
  }

  // Adiciona evento para as opções de visualização
  visualizacaoOptions.forEach((option) => {
    option.addEventListener("change", async (event) => {
      if (event.target.value === "pesquisar") {
        searchSection.style.display = "block";
        listaHorarios.style.display = "none";
        searchResults.style.display = "none"; // Esconde resultados de pesquisa
      } else {
        searchSection.style.display = "none";
        listaHorarios.style.display = "block";
        searchResults.style.display = "none"; // Esconde resultados de pesquisa
        await listarHorarios(); // Chama a função para listar horários
      }
    });
  });

  // Adiciona evento para o botão de pesquisa
  const searchButton = document.getElementById("search-button");
  if (searchButton) {
    searchButton.addEventListener("click", async (event) => {
      event.preventDefault(); // Previne o refresh da página
      await pesquisarHorarios(); // Chama a função para pesquisar horários
      listaHorarios.style.display = "none"; // Esconde a lista de horários
      searchResults.style.display = "block"; // Mostra os resultados da pesquisa
    });
  } else {
    console.error("Botão de pesquisa não encontrado");
  }
  //Botão de adicionar médico
  const adicionarMedicoBtn = document.getElementById("adicionar-medico-btn");

  if (adicionarMedicoBtn) {
    adicionarMedicoBtn.addEventListener("click", adicionarMedico);
  } else {
    console.error("Botão 'Adicionar Médico' não encontrado.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupDoctorForm();
  setupUpdateDoctorForm();
  setupEventListeners2();
  preencherSelectEspecialidades("criar-doutor-speciality");
  preencherSelectEspecialidades("criar-doutor-speciality");
  preencherSelectMedicosEmergencia();
});
