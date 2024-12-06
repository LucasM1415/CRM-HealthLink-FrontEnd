// Seletores de elementos do DOM
const patientForm = document.getElementById("userForm"),
  // imgInput = document.querySelector(".img"),
  // file = document.getElementById("imgInput"),
  userName = document.getElementById("name"),
  email = document.getElementById("email"),
  sDate = document.getElementById("sDate"),
  submitBtn = document.querySelector(".submit"),
  modalTitle = document.querySelector("#userForm .modal-title"),
  newUserBtn = document.querySelector('.newUserBtn'),
  searchUserBtn = document.querySelector(".searchUser"),
  deleteModal = document.getElementById("deleteModal"),
  confirmDeleteBtn = document.getElementById("confirmDelete"),
  cancelDeleteBtn = document.getElementById("cancelDelete");

let isEdit = false, editId;


showPatients();


// Gerenciar a exibição das seções com base no clique no menu
document.addEventListener('DOMContentLoaded', () => {
  const menuLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = document.querySelectorAll('.content-section');

  // Função para mostrar a seção correspondente
  const showSection = (id) => {
    sections.forEach(section => {
      if (section.id === id) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  };

  // Adiciona os eventos de clique aos links do menu
  menuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      showSection(targetId);
    });
  });

  showSection('pacientes');
});





// Seção de Paciente
// - Função Exibir Informações na tabela
async function showPatients() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Usuário não autenticado.");
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

    if (!response.ok) throw new Error("Erro ao buscar pacientes.");

    const patients = await response.json();
    renderPacientes(patients);
  } catch (error) {
    console.error("Erro ao exibir pacientes:", error);
    const patientData = document.querySelector("table tbody");
    patientData.innerHTML =
      '<tr><td colspan="5">Erro ao exibir pacientes.</td></tr>';
  }
}
// Renderiza os pacientes na tabela
function renderPacientes(data) {
  const patientData = document.querySelector("table tbody");

  if (!patientData) {
    console.error('Elemento com ID "table tbody" não encontrado.');
    return;
  }

  patientData.innerHTML = "";

  if (!Array.isArray(data)) {
    console.error("Os dados fornecidos não são uma lista de pacientes.");
    return;
  }

  data.forEach((patient, index) => {
    const row = `
        <tr class="patientDetails">
          <td>${index + 1}</td>
          
          <td>${patient.name || "Nome não disponível"}</td>
          <td>${patient.birthDate
        ? new Date(patient.birthDate).toLocaleDateString()
        : "Data de Nascimento não disponível"
      }</td>
          
          <td>${patient.email || "Email não disponível"}</td>
          <td>
            <button class="btn btn-success" 
              onclick="readInfo('${patient.name}', '${patient.birthDate}', '${patient.email}')" 
              data-bs-toggle="modal" data-bs-target="#readData">
              <i class="bi bi-eye"></i>
            </button>

            <button class="btn btn-primary" 
              onclick="editPatient(${index}, '${patient.name}', '${patient.birthDate}','${""}', '${patient.email}')" 
              data-bs-toggle="modal" data-bs-target="#userForm">
              <i class="bi bi-pencil-square"></i>
            </button>

            <button class="btn btn-danger" 
              onclick="confirmDelete('${encodeURIComponent(patient.email)}')">
              <i class="bi bi-trash"></i>
            </button>

          </td>
        </tr>`;
    patientData.innerHTML += row;
  });
}
// Função para visualizar informações no modal
function readInfo( name, birthDate, email) {
  document.getElementById("showName").value = name || "Nome não disponível";
  document.getElementById("showsDate").value =
    birthDate ? new Date(birthDate).toISOString().split("T")[0] : "";
  document.getElementById("showEmail").value = email || "E-mail não disponível";

  // Se quiser usar a imagem no modal, descomente e ajuste:
  // const imgElement = document.querySelector('.img-read');
  // if (imgElement) imgElement.src = picture || './image/Profile Icon.webp';
}


// - Função Criar Paciente
async function createPatient(token, data) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/employee/create/patient`;

  const requestBody = {
    name: data["criar-paciente-nome"],
    birthDate: data["criar-paciente-data-nascimento"],
    cpf: data["criar-paciente-cpf"],
    email: data["criar-paciente-email"],
    password: data["criar-paciente-password"],
    accessLevel: "PATIENT",
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
      const errorText = await response.text();
      throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`);
    }

    showPatients();
    handleCreationResult("success");

  } catch (error) {
    console.error("Erro ao criar paciente:", error);
    handleCreationResult("error");
  }
}
async function handleCreationResult(status) {
  const resultsDiv = document.getElementById("resultsCreate");
  resultsDiv.className = "resultsCreate";
  const token = localStorage.getItem("token");

  switch (status) {
    case "success":
      resultsDiv.innerText = "Paciente criado com sucesso!";
      resultsDiv.classList.add("success");
      if (token) {
        await showPatients();

      }
      break;

    case "error":
      resultsDiv.innerText = "Erro ao criar paciente!";
      resultsDiv.classList.add("error");
      if (token) {
        await showPatients();

      }
      break;

    default:
      resultsDiv.innerText = "Status desconhecido!";
      resultsDiv.classList.add("error");
      break;
  }
}
async function setupPacienteForm() {
  const form = document.getElementById("criar-paciente-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("Evento submit disparado!");

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token não encontrado.");
        return;
      }

      const data = {
        "criar-paciente-nome": document.getElementById("criar-paciente-nome").value,
        "criar-paciente-data-nascimento": document.getElementById("criar-paciente-data-nascimento").value,
        "criar-paciente-cpf": document.getElementById("criar-paciente-cpf").value,
        "criar-paciente-email": document.getElementById("criar-paciente-email").value,
        "criar-paciente-password": document.getElementById("criar-paciente-password").value,
      };

      await createPatient(token, data);
    });
  }
}


// - Função Atualizar Paciente
function editPatient(index, name, birthDate, cpf, email) {
  document.getElementById("criar-paciente-nome").value = name;
  document.getElementById("criar-paciente-data-nascimento").value = birthDate;
  document.getElementById("criar-paciente-cpf").value = cpf;
  document.getElementById("criar-paciente-email").value = email;

  const form = document.getElementById("criar-paciente-form");
  form.setAttribute("data-mode", "update");
  form.setAttribute("data-index", index);

  const submitButton = document.getElementById("newUserBtn");
  submitButton.textContent = "Atualizar Paciente";
}
async function updatePatient(token, data) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/employee/paciente`;

  const requestBody = {
    name: data["criar-paciente-nome"],
    birthDate: data["criar-paciente-data-nascimento"],
    cpf: data["criar-paciente-cpf"],
    email: data["criar-paciente-email"],
    password: data["criar-paciente-password"],
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
      const errorText = await response.text();
      throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`);
    }

    showPatients();
    await handleUpdateResult("success");


  } catch (error) {
    // console.error("Erro ao atualizar paciente:", error);
    await handleUpdateResult("error");
  }
}

async function handleUpdateResult(status) {
  const resultsDiv = document.getElementById("resultsCreate");
  resultsDiv.className = "resultsCreate";
  const token = localStorage.getItem("token");

  switch (status) {
    case "success":
      resultsDiv.innerText = "Paciente atualizado com sucesso!";
      resultsDiv.classList.add("success");

      if (token) {
        await showPatients();
      }

      // Espera 3 segundos e limpa o conteúdo
      setTimeout(() => {
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsCreate";
      }, 3000);
      break;

    case "error":
      resultsDiv.innerText = "Erro ao atualizar paciente!";
      resultsDiv.classList.add("error");

      if (token) {
        await showPatients();
      }

      // Espera 3 segundos e limpa o conteúdo
      setTimeout(() => {
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsCreate";
      }, 3000);
      break;

    default:
      resultsDiv.innerText = "Status desconhecido!";
      resultsDiv.classList.add("error");

      // Espera 3 segundos e limpa o conteúdo
      setTimeout(() => {
        document.getElementById("criar-paciente-nome").value = "";
        document.getElementById("criar-paciente-data-nascimento").value = "";
        document.getElementById("criar-paciente-cpf").value = "";
        document.getElementById("criar-paciente-email").value = "";
        document.getElementById("crir-paciente-password").value = "";
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsCreate";
      }, 3000);
      break;
  }
}

function limparCampos() {
  // Seleciona o elemento resultsDiv
  const resultsDiv = document.getElementById("resultsCreate");

  // Limpa os campos do formulário
  document.getElementById("criar-paciente-nome").value = "";
  document.getElementById("criar-paciente-data-nascimento").value = "";
  document.getElementById("criar-paciente-cpf").value = "";
  document.getElementById("criar-paciente-email").value = "";

  // Limpa os resultados e classes
  resultsDiv.innerText = "";
  resultsDiv.className = "resultsCreate";
}

function limparPesquisar(){
  const resultsDiv = document.getElementById("resultsGet");
  resultsDiv.innerHTML="";
}

async function setupPacienteForm() {
  const form = document.getElementById("criar-paciente-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token não encontrado.");
        return;
      }

      const data = {
        "criar-paciente-nome": document.getElementById("criar-paciente-nome").value,
        "criar-paciente-data-nascimento": document.getElementById("criar-paciente-data-nascimento").value,
        "criar-paciente-cpf": document.getElementById("criar-paciente-cpf").value,
        "criar-paciente-email": document.getElementById("criar-paciente-email").value,
        "criar-paciente-password": document.getElementById("criar-paciente-password").value,
      };

      const mode = form.getAttribute("data-mode");

      if (mode === "update") {
        await updatePatient(token, data);
      } else {
        await createPatient(token, data);
      }

      form.reset();
      form.removeAttribute("data-mode");
      document.getElementById("newUserBtn").textContent = "Criar Paciente";
    });
  }
}


// - Função Buscar Paciente por Email
// Limpa o campo de pesquisa ao abrir o modal
document.getElementById("userSearch").addEventListener("show.bs.modal", () => {
  document.getElementById("searchEmailPatient").value = "";
  clearResults();
});
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
    renderPacienteDaBusca(data);
  } catch (error) {
    console.error("Erro na requisição:", error);
    handleSearchResult("error", "Erro ao buscar paciente.");
  }
}

function handleSearchResult(status, message) {
  const resultsDiv = document.getElementById("resultsGet");
  resultsDiv.className = "mt-3 resultsGet"; // Reseta as classes base


  switch (status) {
    case "success":
      resultsDiv.innerText = message || "Paciente encontrado com sucesso!";
      resultsDiv.classList.add("success");
      break;

    case "error":
      resultsDiv.innerText = message || "Erro ao buscar paciente!";
      resultsDiv.classList.add("error");
      break;

    default:
      resultsDiv.innerText = message || "Status desconhecido!";
      resultsDiv.classList.add("error");
      break;
  }
}

// Função para exibir os dados do paciente no modal ou página
function renderPacienteDaBusca(data) {
  const resultsDiv = document.getElementById("resultsGet");
  resultsDiv.innerHTML = "";

  if (data) {
    resultsDiv.innerHTML = `
      <p><strong>Nome:</strong> ${data.name || "Nome não disponível"}</p>
      <p><strong>Data de nascimento:</strong> ${data.birthDate
        ? new Date(data.birthDate).toLocaleDateString()
        : "Data de Nascimento não disponível"
      }</p>
      <p><strong>Email:</strong> ${data.email || "Email não disponível"}</p>
    `;
  } else {
    resultsDiv.innerHTML = `<p>Nenhum paciente encontrado.</p>`;
  }
}

// Função para limpar resultados
function clearResults() {
  const resultsDiv = document.getElementById("resultsGet");
  if (resultsDiv) {
    resultsDiv.innerHTML = "";
  }
}

document.querySelector(".searchConfirm").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const emailPaciente = document.getElementById("searchEmailPatient").value.trim();

  if (!emailPaciente) {
    alert("Por favor, insira um e-mail de paciente válido.");
    return;
  }
  await buscarPaciente(token, emailPaciente);
});



// - Função Deletar Paciente
function confirmDelete(email) {
  const deleteModal = document.getElementById("deleteModal");
  const confirmButton = document.getElementById("confirmDelete");
  const cancelButton = document.getElementById("cancelDelete");

  deleteModal.style.display = "block";

  // Define o comportamento do botão "Sim"
  confirmButton.onclick = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Usuário não autenticado.");
      deleteModal.style.display = "none";
      return;
    }

    await removerPaciente(token, email);
    deleteModal.style.display = "none";
  };

  // Define o comportamento do botão "Não"
  cancelButton.onclick = () => {
    deleteModal.style.display = "none";
  };
}
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

    handleRemovalResult("success", token);
  } catch (error) {
    console.error("Erro na requisição:", error);
    handleRemovalResult("error", token);
  }
}
async function handleRemovalResult(status, token) {
  const resultsDiv = document.getElementById("resultsDelete");

  switch (status) {
    case "success":
      resultsDiv.innerText = "Paciente removido com sucesso!";

      // Atualiza a lista de pacientes na tela após remoção
      if (token) {
        await showPatients();
        // await listarPacientes(token); // Atualiza a lista de pacientes
      }
      break;

    case "error":
      resultsDiv.innerText = "Erro ao remover paciente.";
      break;

    default:
      resultsDiv.innerText = "Status desconhecido.";
      break;
  }
}




// Função para limpar os campos do formulário
// document.getElementById("clearForm").addEventListener("click", () => {
//   document.getElementById("criar-paciente-form").reset();
// });


// document.addEventListener('DOMContentLoaded', () => {
//     const newUserBtn = document.getElementById('newUserBtn'); 

//     if (newUserBtn) {
//         newUserBtn.addEventListener('click', () => {
//             modalTitle.innerText = "Preencha o Formulário";
//             isEdit = false;
//         });
//     } else {
//         console.error('Botão "Novo Paciente" não encontrado!');
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('userForm');
  if (userForm) {
    updateUserName();
    //setupPacienteForm();
  } else {
    console.error("Modal não encontrado.");
  }
});