async function showAppointments() {
   const token = localStorage.getItem("token");
   if (!token) {
       alert("Usuário não autenticado.");
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
    const appointmentData = document.querySelector("appointmentTableBody");
    appointmentData.innerHTML =
      '<tr><td colspan="6">Erro ao listar consultas.</td></tr>';
  }
}

function renderConsultas(data) {
    const appointmentData = document.querySelector("#appointmentTableBody");
  
    if (!appointmentData) {
      console.error("Elemento da tabela de consultas não encontrado.");
      return;
    }
  
    appointmentData.innerHTML = "";
  
    if (!Array.isArray(data)) {
      console.error("Os dados fornecidos não são uma lista de consultas.");
      return;
    }
  
    data.forEach((consulta, index) => {
      const row = `
        <tr class="appointmentDetails">
          <td>${index + 1}</td>
          <td>${consulta.date ? new Date(consulta.date).toLocaleDateString() : "Data não disponível"}</td>
          <td>${consulta.inicio || "Horário não disponível"}</td>
          <td>${consulta.namePatient || "Paciente não disponível"}</td>
          <td>${consulta.nameDoctor || "Doutor não disponível"}</td>
          
        </tr>`;
      appointmentData.innerHTML += row;
    });
  }
  
  function readInfo(patientName, doctorName, date, time) {
    document.getElementById("read-consulta-paciente").value = patientName || "Não disponível";
    document.getElementById("read-consulta-doctor").value = doctorName || "Não disponível";
    document.getElementById("read-consulta-date").value = date || "0000-00-00";
    document.getElementById("read-consulta-hora").value = time || "00:00";
  }
  




// Função para Criar Consultas
async function criarConsulta() {
  const token = localStorage.getItem("token");

  if (!token) {
    handleSearchResult("error", "Token de autenticação não encontrado. Por favor, faça login novamente.");
    return;
  }

  const data = document.getElementById("consulta-data").value;
  const horarioSelecionado = document.getElementById("consulta-horarios-disponiveis").value; 
  const medicoId = document.getElementById("criar-consulta-medico").value;
  const pacienteId = document.getElementById("criar-consulta-paciente").value;
  const especialidade = document.getElementById("consulta-especialidade").value;

  if (!data || !horarioSelecionado || !medicoId || !pacienteId || !especialidade) {
    handleSearchResult("error", "Por favor, preencha todos os campos.");
    return;
  }

  const [horaInicial, horaFinal] = horarioSelecionado.split(" - ");
  if (!horaInicial || !horaFinal) {
    handleSearchResult("error", "Por favor, selecione um horário válido.");
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

  console.log(corpoRequisicao);

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
      handleSearchResult("success", "Consulta criada com sucesso.");
      await showAppointments();
    } else {
      const errorText = await response.text();
      console.error("Erro:", errorText);
      handleSearchResult("error", `Erro ao criar a consulta: ${response.status}`);
    }
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    handleSearchResult("error", "Erro ao criar a consulta.");
  }
}

document
  .getElementById("form-criar-consulta")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    await criarConsulta();
  });


document
  .getElementById("form-criar-consulta")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); 
    await criarConsulta();
  });

  function handleSearchResult(status, message) {
    const resultsDiv = document.getElementById("resultsGetAppointment");
    resultsDiv.className = "mt-3 resultsGet"; // Reseta as classes base
    
    switch (status) {
      case "success":
        resultsDiv.innerText = message || "Consulta criada com sucesso!";
        resultsDiv.classList.add("success");
        break;
  
      case "error":
        resultsDiv.innerText = message || "Erro ao criar consulta!";
        resultsDiv.classList.add("error");
        break;
  
      default:
        resultsDiv.innerText = message || "Status desconhecido!";
        resultsDiv.classList.add("error");
        break;
    }
  }
  

// Função para buscar horários disponíveis da API
async function buscarHorariosDisponiveis(especialidade, data) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return [];
  }

  const url = `https://crm-healthlink.onrender.com/api/calendario/disponibilidades/${encodeURIComponent(especialidade)}/${encodeURIComponent(
    data
  )}`;

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
  const selectElement = document.getElementById("consulta-horarios-disponiveis");

  if (!selectElement) {
    console.error("Elemento <select> não encontrado!");
    return;
  }

  selectElement.innerHTML = "";

  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Selecione um horário";
  selectElement.appendChild(optionDefault);

  horarios.forEach((horario) => {
    const option = document.createElement("option");
    option.value = `${horario.homeTime} - ${horario.endTime}`;
    option.textContent = `${horario.homeTime} - ${horario.endTime}`;
    selectElement.appendChild(option);
  });
}

// Função para preencher os horários quando a data ou especialidade forem alteradas
async function preencherHorarios() {
  const data = document.getElementById("consulta-data").value;
  const especialidade = document.getElementById("consulta-especialidade").value;

  if (!data || !especialidade) {
    return;
  }

  const horariosDisponiveis = await buscarHorariosDisponiveis(especialidade, data);
  renderizarHorariosSelect(horariosDisponiveis);
}

document.getElementById("consulta-data").addEventListener("change", preencherHorarios);
document.getElementById("consulta-especialidade").addEventListener("change", preencherHorarios);




// Função para buscar consulta
async function buscarConsulta(event) {
  event.preventDefault(); 

  const token = localStorage.getItem("token");
  const emailPaciente = document.getElementById("searchEmailPaciente").value;
  const emailDoctor = document.getElementById("searchDoctorEmail").value;
  const date = document.getElementById("searchData").value;
  const horaInicio = document.getElementById("searchHoraInicio").value;

  if (!token || !emailPaciente || !emailDoctor || !date || !horaInicio) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/appointment?emailMedico=${encodeURIComponent(emailDoctor)}&emailPaciente=${encodeURIComponent(emailPaciente)}&date=${encodeURIComponent(date)}&inicio=${encodeURIComponent(horaInicio)}:00`;

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

// Função para exibir resultados de consulta
function renderConsulta(data) {
  const resultsDiv = document.getElementById("consulta-results");
  resultsDiv.innerHTML = "";

  if (data && data.length > 0) {
    data.forEach(consulta => {
      resultsDiv.innerHTML += `
        <p><strong>Paciente:</strong> ${consulta.namePatient}</p>
        <p><strong>Médico:</strong> ${consulta.nameDoctor}</p>
        <p><strong>Data:</strong> ${new Date(consulta.date).toLocaleDateString()}</p>
        <p><strong>Hora de Início:</strong> ${consulta.startTime}</p>
        <hr />
      `;
    });
  } else {
    resultsDiv.innerHTML = "<p>Nenhuma consulta encontrada.</p>";
  }
}

document.querySelector(".searchConfirmConsulta").addEventListener("click", async () => {
  const token = localStorage.getItem("token"); 
  const emailPaciente = document.getElementById("searchEmailPaciente").value.trim();
  const emailDoctor = document.getElementById("searchDoctorEmail").value.trim();
  const dataConsulta = document.getElementById("searchData").value.trim();
  const horaInicio = document.getElementById("searchHoraInicio").value.trim();

  if (!emailPaciente || !emailDoctor || !dataConsulta || !horaInicio) {
    alert("Por favor, insira todos os dados para a consulta.");
    return;
  }

  await buscarConsulta(event); 
});





document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    if (token) {
        showAppointments(token); 
    } else {
      console.error("Token não encontrado. Usuário não autenticado.");
    }
  });