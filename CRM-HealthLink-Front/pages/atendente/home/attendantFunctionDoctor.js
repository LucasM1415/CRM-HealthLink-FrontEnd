// Função para listar os médicos na tabela
async function showDoctors() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado.");
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
      renderMedicos(medicos);
    } catch (error) {
      console.error("Erro na requisição:", error);
      const doctorTableBody = document.querySelector("#doctorTableBody");
      doctorTableBody.innerHTML =
        '<tr><td colspan="8">Erro ao listar médicos.</td></tr>';
    }
  }


// Função para renderizar médicos na tabela
function renderMedicos(medicos) {
    const doctorTableBody = document.querySelector("#doctorTableBody");
  
    if (!doctorTableBody) {
      console.error("Elemento com ID 'doctorTableBody' não encontrado.");
      return;
    }
  
    doctorTableBody.innerHTML = ""; 
  
    if (!Array.isArray(medicos)) {
      console.error("Os dados fornecidos não são uma lista de médicos.");
      return;
    }
  
    medicos.forEach((medico, index) => {
      // Verificar se a especialidade existe e se é um array
    //   let especialidades = "Especialidade não disponível";  // Valor padrão
    //   if (medico.specialty && Array.isArray(medico.specialty) && medico.specialty.length > 0) {
    //     especialidades = medico.specialty.join(", "); // Junta as especialidades se for um array
    //   }
      const row = `
        <tr class="doctorDetails">
          <td>${index + 1}</td>
          <td>${medico.name || "Nome não disponível"}</td>
          <td>${medico.birthDate ? new Date(medico.birthDate).toLocaleDateString() : "Data não disponível"}</td>
          <td>${medico.crm || "CRM não disponível"}</td>
          <td>${medico.email || "E-mail não disponível"}</td>
          <td>${medico.speciality || "Especialição não disponível"}</td>
          <td>
            <button class="btn btn-success" 
              onclick="readInfoDoctor('${medico.picture}', '${medico.name}', '${medico.birthDate}', '${medico.crm}', '${medico.email}', '${medico.speciality}')" 
              data-bs-toggle="modal" data-bs-target="#doctorReadData">
              <i class="bi bi-eye"></i>
            </button>
          </td>
        </tr>
      `;
      doctorTableBody.innerHTML += row;
    });
  }


function readInfoDoctor(picture, name, birthDate, crm, email, especialidade) {
    document.getElementById("doctorShowName").value = name || "Nome não disponível";
    document.getElementById("doctorShowDate").value =
      birthDate ? new Date(birthDate).toISOString().split("T")[0] : "";
      document.getElementById("doctorShowCRM").value = crm || "CRM não disponível";
    document.getElementById("doctorShowEmail").value = email || "E-mail não disponível";
    document.getElementById("doctorShowSpecialty").value = especialidade || "Especialização não disponível";
  
    // Se quiser usar a imagem no modal, descomente e ajuste:
    // const imgElement = document.querySelector('.img-read');
    // if (imgElement) imgElement.src = picture || './image/Profile Icon.webp';
  }
  

  document.getElementById("doctorSearch").addEventListener("show.bs.modal", () => {
      document.getElementById("searchEmailDoctor").value = "";
      clearResults();
   });

  async function buscarMedico(token, emailMedico) {
    if (!token) {
        alert("Usuário não autenticado.");
        return;
      }
    
      const url = `https://crm-healthlink.onrender.com/api/employee/doctor/${emailMedico}`;

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
    document.getElementById("resultsGetDoctor").innerText =
      "Erro ao buscar médico.";
  }
}

function renderMedico(data) {
    const resultsDiv = document.getElementById("resultsGetDoctor");
    resultsDiv.innerHTML = ""; 
  
    if (data) {
      resultsDiv.innerHTML = `
        <p><strong>Nome:</strong> ${data.name || "Nome não disponível"}</p>
        <p><strong>Telefone:</strong> ${data.birthDate
            ? new Date(data.birthDate).toLocaleDateString()
            : "Data de Nascimento não disponível"}</p>
        <p><strong>Especialidade:</strong> ${data.speciality || "Especialidade não disponível"}</p>
        <p><strong>Especialidade:</strong> ${data.crm || "CRM não disponível"}</p>
        <p><strong>Email:</strong> ${data.email || "Email não disponível"}</p>
      `;
    } else {
      resultsDiv.innerHTML = `<p>Nenhum médico encontrado.</p>`;
    }
  }
  
  function renderError(message) {
    const resultsDiv = document.getElementById("resultsGetDoctor");
    resultsDiv.innerHTML = `<p class="text-danger">${message}</p>`;
  }
  
  
  function clearResults() {
    const resultsDiv = document.getElementById("resultsGetDoctor");
    if (resultsDiv) {
      resultsDiv.innerHTML = "";
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".searchConfirmDoctor").addEventListener("click", async () => {
      const token = localStorage.getItem("token");
      const emailMedico = document.getElementById("searchEmailDoctor").value.trim();
    
      if (!emailMedico) {
        alert("Por favor, insira um e-mail de doutor válido.");
        return;
      }
    
      await buscarMedico(token, emailMedico);
    });
  });
  
  
  document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    if (token) {
        showDoctors(token); 
    } else {
      console.error("Token não encontrado. Usuário não autenticado.");
    }
  });