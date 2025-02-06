// Configuração do formulário de criação de médico
async function setupDoctorForm() {
    setupDoctorCreateForm();
    setupDoctorUpdateForm();
}


// Função Criar Médico
async function createDoctor(token, data) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/employee/doctor`;

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
      throw new Error(
        `Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`
      );
    }

    handleDoctorCreationResult("success");
    showDoctors();
  } catch (error) {
    console.error("Erro ao criar médico:", error);
    handleDoctorCreationResult("error");
  }
}

// Função para lidar com o resultado da criação do médico
async function handleDoctorCreationResult(status) {
  const resultsDiv = document.getElementById("resultsCreateDoctor");
  resultsDiv.className = "resultsCreateDoctor";
  const token = localStorage.getItem("token");

  switch (status) {
    case "success":
      resultsDiv.innerText = "Médico criado com sucesso!";
      resultsDiv.classList.add("success");
      if (token) {
        await showDoctors();
      }
      break;

    case "error":
      resultsDiv.innerText = "Erro ao criar médico!";
      resultsDiv.classList.add("error");
      if (token) {
        await showDoctors();
      }
      break;

    default:
      resultsDiv.innerText = "Status desconhecido!";
      resultsDiv.classList.add("error");
      break;
  }
}




// - Função Atualizar Doctor
function editDoctor(index, name, birthDate, cpf, crm, email, speciality) {

  document.getElementById("update-doutor-nome").value = name;
  document.getElementById("update-doutor-data-nascimento").value = birthDate;
  document.getElementById("update-doutor-cpf").value = cpf;
  document.getElementById("update-doutor-crm").value = crm;
  document.getElementById("update-doutor-email").value = email;
  // document.getElementById("criar-doutor-speciality").value = speciality;
  // const form = document.getElementById("update-doutor-form");
  // form.setAttribute("data-mode", "update");
  // form.setAttribute("data-index", index);

  // const submitButton = document.getElementById("newDoctorBtn");
  // submitButton.textContent = "Atualizar Médico";
}

async function setupDoctorCreateForm() {
  const form = document.getElementById("criar-doutor-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Previne o refresh da página

      const token = localStorage.getItem("token");
      const data = {
        "criar-doutor-email": document.getElementById("criar-doutor-email").value,
        "criar-doutor-nome": document.getElementById("criar-doutor-nome").value,
        "criar-doutor-data-nascimento": document.getElementById("criar-doutor-data-nascimento").value,
        "criar-doutor-cpf": document.getElementById("criar-doutor-cpf").value,
        "criar-doutor-crm": document.getElementById("criar-doutor-crm").value,
        "criar-doutor-speciality": document.getElementById("criar-doutor-speciality").value,
        "criar-doutor-password": document.getElementById("criar-doutor-password").value,
      };

      await createDoctor(token, data);

      form.reset();
      document.getElementById("newDoctorBtn").textContent = "Criar Médico";

    });
  }
}

async function updateDoctor(token, data) {
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/employee/doctor`;

  const requestBody = {
    name: data["update-doutor-nome"],
    birthDate: data["update-doutor-data-nascimento"],
    cpf: data["update-doutor-cpf"],
    crm: data["update-doutor-crm"],
    speciality: [data["update-doutor-speciality"]],  // Garantindo que 'speciality' seja um array
    email: data["update-doutor-email"],
    password: data["update-doutor-password"],
  };



  console.log(requestBody);

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
      throw new Error(
        `Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`
      );
    }

    showDoctors();
    handleUpdateDoctorResult("success");

  } catch (error) {
    console.error("Erro na requisição:", error);
    handleUpdateDoctorResult("error");
  }
}

function limparCamposDoctor() {
  const resultsDiv = document.getElementById("resultsCreateDoctor");
  if (resultsDiv) {
    alert
    resultsDiv.className = "resultsCreateDoctor"; 
    resultsDiv.innerHTML = ""; 
  }

  const form = document.getElementById("criar-doutor-form");
  
  if (form) {

    form.reset();

    form.removeAttribute("data-mode");
  }

  const newDoctorBtn = document.getElementById("newDoctorBtn");
  if (newDoctorBtn) {
    newDoctorBtn.textContent = "Criar Médico";
  }

}




async function handleUpdateDoctorResult(status) {
  const resultsDiv = document.getElementById("resultsUpdateDoctor");
  resultsDiv.className = "resultsUpdateDoctor"; // Reseta as classes
  const token = localStorage.getItem("token");

  switch (status) {
    case "success":
      resultsDiv.innerText = "Médico atualizado com sucesso!";
      resultsDiv.classList.add("success");

      if (token) {
        await showDoctors(); // Atualiza a tabela de médicos
      }

      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsUpdateDoctor";
      }, 3000);
      break;

    case "error":
      resultsDiv.innerText = "Erro ao atualizar médico!";
      resultsDiv.classList.add("error");

      if (token) {
        await showDoctors(); // Tenta atualizar a tabela mesmo em caso de erro
        await preencherSelectEspecialidades("update-doutor-speciality"); // Recarrega especialidades
      }

      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsUpdateDoctor";
      }, 3000);
      break;

    default:
      resultsDiv.innerText = "Status desconhecido!";
      resultsDiv.classList.add("error");

      // Limpa o formulário e mensagem após 3 segundos
      setTimeout(() => {
        document.getElementById("update-doutor-nome").value = "";
        document.getElementById("update-doutor-data-nascimento").value = "";
        document.getElementById("update-doutor-cpf").value = "";
        document.getElementById("update-doutor-crm").value = "";
        document.getElementById("update-doutor-email").value = "";
        document.getElementById("update-doutor-speciality").value = "";
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsUpdateDoctor";
      }, 3000);
      break;
  }
}

async function setupDoctorUpdateForm() {
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

      await updateDoctor(token, data);

      form.reset();
      document.getElementById("updateDoctorBtn").textContent = "Atualizar Médico";

    });
  }
}






// Garanta que a função seja chamada após o DOM ser carregado
document.addEventListener("DOMContentLoaded", () => {
  setupDoctorForm();
});