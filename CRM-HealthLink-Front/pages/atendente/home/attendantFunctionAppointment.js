async function showAppointments() {
   const token = localStorage.getItem("token");
   if (!token) {
       alert("Usuário não autenticado.");
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
  
  // Função para preencher os detalhes no modal
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
    alert("Token de autenticação não encontrado. Por favor, faça login novamente.");
    return;
  }

  // Obter dados do formulário
  const data = document.getElementById("consulta-data").value;
  const horarioSelecionado = document.getElementById("consulta-horarios-disponiveis").value; // Ajustado para corresponder ao ID do select de horários
  const medicoId = document.getElementById("criar-consulta-medico").value;
  const pacienteId = document.getElementById("criar-consulta-paciente").value;
  const especialidade = document.getElementById("consulta-especialidade").value;


  // Validação dos campos
  if (!data || !horarioSelecionado || !medicoId || !pacienteId || !especialidade) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const [horaInicial, horaFinal] = horarioSelecionado.split(" - ");
  if (!horaInicial || !horaFinal) {
    alert("Por favor, selecione um horário válido.");
    return;
  }

  // Construção do corpo da requisição
  const corpoRequisicao = {
    email_patient: pacienteId,
    email_doctor: medicoId,
    date: data,
    inicio: horaInicial.trim(),
    speciality: especialidade,
    fim: horaFinal.trim(),
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
      alert("Consulta criada com sucesso.");
      // Opcional: Atualizar lista de consultas
      await showAppointments()
    } else {
      const errorText = await response.text();
      console.error("Erro:", errorText);
      alert(`Erro ao criar a consulta: ${response.status}`);
    }
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    alert("Erro ao criar a consulta.");
  }
}

// Listener para o formulário
document
  .getElementById("form-criar-consulta")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Previne o envio padrão
    await criarConsulta();
  });

// Função para buscar horários disponíveis da API
async function buscarHorariosDisponiveis(especialidade, data) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return [];
  }

  const url = `http://${ip}:8080/api/calendario/disponibilidades/${encodeURIComponent(especialidade)}/${encodeURIComponent(
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
  const data = document.getElementById("consulta-data").value;
  const especialidade = document.getElementById("consulta-especialidade").value;

  // Verificar se a data e especialidade foram selecionadas
  if (!data || !especialidade) {
    return;
  }

  // Buscar os horários disponíveis
  const horariosDisponiveis = await buscarHorariosDisponiveis(especialidade, data);
  renderizarHorariosSelect(horariosDisponiveis);
}

// Adicionar eventos para atualizar os horários ao alterar a data ou especialidade
document.getElementById("consulta-data").addEventListener("change", preencherHorarios);
document.getElementById("consulta-especialidade").addEventListener("change", preencherHorarios);





document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    if (token) {
        showAppointments(token); // Passando o token para listar médicos
    } else {
      console.error("Token não encontrado. Usuário não autenticado.");
    }
  });