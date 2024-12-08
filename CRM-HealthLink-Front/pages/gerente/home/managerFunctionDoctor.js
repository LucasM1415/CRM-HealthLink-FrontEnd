// Configuração do formulário de criação de médico
async function setupDoctorForm() {
  const form = document.getElementById("criar-doutor-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token não encontrado.");
        return;
      }

      const data = {
        "criar-doutor-nome": document.getElementById("criar-doutor-nome").value,
        "criar-doutor-data-nascimento": document.getElementById(
          "criar-doutor-data-nascimento"
        ).value,
        "criar-doutor-cpf": document.getElementById("criar-doutor-cpf").value,
        "criar-doutor-crm": document.getElementById("criar-doutor-crm").value,
        "criar-doutor-speciality": document.getElementById(
          "criar-doutor-speciality"
        ).value,
        "criar-doutor-email":
          document.getElementById("criar-doutor-email").value,
        "criar-doutor-password": document.getElementById(
          "criar-doutor-password"
        ).value,
      };

      await createDoctor(token, data);
    });
  }
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
  
  document.getElementById("criar-doutor-nome").value = name;
  document.getElementById("criar-doutor-data-nascimento").value = birthDate;
  document.getElementById("criar-doutor-cpf").value = cpf;
  document.getElementById("criar-doutor-crm").value = crm;
  document.getElementById("criar-doutor-email").value = email;
  document.getElementById("criar-doutor-speciality").value = speciality;

  const form = document.getElementById("criar-doutor-form");
  form.setAttribute("data-mode", "update");
  form.setAttribute("data-index", index);

  const submitButton = document.getElementById("newDoctorBtn");
  submitButton.textContent = "Atualizar Médico";
}

async function setupDoctorForm() {
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

      const mode = form.getAttribute("data-mode");

      if (mode === "update") {
        await updateDoctor(token, data);
      } else {
        await createDoctor(token, data);
      }

      form.reset();
      form.removeAttribute("data-mode");
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
    name: data["criar-doutor-nome"],
    birthDate: data["criar-doutor-data-nascimento"],
    cpf: data["criar-doutor-cpf"],
    crm: data["criar-doutor-crm"],
    speciality: [data["criar-doutor-speciality"]],
    accessLevel: "DOCTOR",
    email: data["criar-doutor-email"],
    password: data["criar-doutor-password"],
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

async function handleUpdateDoctorResult(status) {
  const resultsDiv = document.getElementById("resultsCreateDoctor");
  resultsDiv.className = "resultsCreateDoctor"; // Reseta as classes
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
        resultsDiv.className = "resultsCreateDoctor";
      }, 3000);
      break;

    case "error":
      resultsDiv.innerText = "Erro ao atualizar médico!";
      resultsDiv.classList.add("error");

      if (token) {
        await showDoctors(); // Tenta atualizar a tabela mesmo em caso de erro
        await preencherSelectEspecialidades("criar-doutor-speciality"); // Recarrega especialidades
      }

      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsCreateDoctor";
      }, 3000);
      break;

    default:
      resultsDiv.innerText = "Status desconhecido!";
      resultsDiv.classList.add("error");

      // Limpa o formulário e mensagem após 3 segundos
      setTimeout(() => {
        document.getElementById("criar-doutor-nome").value = "";
        document.getElementById("criar-doutor-data-nascimento").value = "";
        document.getElementById("criar-doutor-cpf").value = "";
        document.getElementById("criar-doutor-crm").value = "";
        document.getElementById("criar-doutor-email").value = "";
        document.getElementById("criar-doutor-speciality").value = "";
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsCreateDoctor";
      }, 3000);
      break;
  }
}










// Garanta que a função seja chamada após o DOM ser carregado
document.addEventListener("DOMContentLoaded", () => {
  setupDoctorForm();
});