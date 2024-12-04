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
  

document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    if (token) {
        showAppointments(token); // Passando o token para listar médicos
    } else {
      console.error("Token não encontrado. Usuário não autenticado.");
    }
  });