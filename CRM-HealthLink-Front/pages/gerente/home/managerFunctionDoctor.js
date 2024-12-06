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
          "criar-doutor-data-nascimento": document.getElementById("criar-doutor-data-nascimento").value,
          "criar-doutor-cpf": document.getElementById("criar-doutor-cpf").value,
          "criar-doutor-crm": document.getElementById("criar-doutor-crm").value,
          "criar-doutor-speciality": document.getElementById("criar-doutor-speciality").value,
          "criar-doutor-email": document.getElementById("criar-doutor-email").value,
          "criar-doutor-password": document.getElementById("criar-doutor-password").value,
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
        throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`);
      }
  
      showDoctors();
      handleDoctorCreationResult("success");
  
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
  

  