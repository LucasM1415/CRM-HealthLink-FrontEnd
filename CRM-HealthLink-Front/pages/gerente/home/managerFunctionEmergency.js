//Criar Prontidão de emergência
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("criar-prontidao-form");
  
    if (form) {
      form.addEventListener("submit", criarProntidaoEmergencia);
    }
  });
  
  // Função para capturar e criar a prontidão de emergência
  async function criarProntidaoEmergencia(event) {
    event.preventDefault(); // Impede o envio do formulário
  
    const token = localStorage.getItem("token"); 
    if (!token) {
      handleProntidaoCreationResult("error");
      return;
    }
  
    // Captura os dados do modal
    const data = document.getElementById("prontidao-data").value;
    let inicio = document.getElementById("prontidao-inicio").value;
    let fim = document.getElementById("prontidao-fim").value;
    const emailsMedicos = document.getElementById("prontidao-emails").value
      .split(",")
      .map(email => email.trim()) // Remove espaços extras
      .filter(email => email !== ""); // Remove entradas vazias
  
    // Adiciona segundos ao horário
    inicio = `${inicio}:00`;
    fim = `${fim}:00`;
  
    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!data || !inicio || !fim || emailsMedicos.length === 0) {
      handleProntidaoCreationResult("error");
      return;
    }
  
    // Monta o objeto para envio
    const prontidaoData = {
      data,
      inicio,
      fim,
      emails_medico: emailsMedicos, 
    };
  
    const url = "https://crm-healthlink.onrender.com/api/prontidao"; // API correta
  
    try {
      // Desativa o botão e exibe "Carregando..."
      const btn = document.getElementById("newProntidaoBtn");
      btn.disabled = true;
      btn.innerText = "Criando...";
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prontidaoData),
      });
  
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
  
      const resposta = await response.json();
      console.log("✅ Prontidão criada com sucesso:", resposta);
      handleProntidaoCreationResult("success");
  
      // fecharModal(); // Fecha o modal e limpa o formulário após a criação
    } catch (error) {
      console.error("❌ Erro ao criar prontidão:", error);
      handleProntidaoCreationResult("error");
    } finally {
      // Reativa o botão e redefine o texto
      btn.disabled = false;
      btn.innerText = "Criar Prontidão";
    }
  }
  
  
  // Função para lidar com o resultado da criação da prontidão
  async function handleProntidaoCreationResult(status) {
    const resultsDiv = document.getElementById("resultsCreateProntidao");
    resultsDiv.className = "resultsCreateProntidao";
  
    const token = localStorage.getItem("token");
  
    switch (status) {
      case "success":
        resultsDiv.innerText = "Prontidão criada com sucesso!";
        resultsDiv.classList.add("success");
        if (token) {
          await listarEmergencias(token);
          fecharModal();
        }
        break;
  
      case "error":
        resultsDiv.innerText = "Erro ao criar prontidão!";
        resultsDiv.classList.add("error");
        if (token) {
          await listarEmergencias(token);
          fecharModal();
        }
        break;
  
      default:
        resultsDiv.innerText = "Status desconhecido!";
        resultsDiv.classList.add("error");
        break;
    }
  }
  
  // Fecha o modal corretamente
  function fecharModal() {
    const modalElement = document.getElementById("prontidaoForm");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  
    // Reseta o formulário
    document.getElementById("criar-prontidao-form").reset();
    document.getElementById("resultsCreate").innerHTML = ""; // Limpa mensagens
  }
  
  





  
  // Função para Listar Prontidão
  async function listarEmergencias(token) {
    if (!token) {
      console.error("Usuário não autenticado.");
      return;
    }
  
    const url = `https://crm-healthlink.onrender.com/api/prontidao`;
  
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
      renderEmergencias(data);
    } catch (error) {
      console.error("Erro na requisição:", error);
      const resultsTable = document.querySelector("table tbody");
      resultsTable.innerHTML =
        '<tr><td colspan="2">Erro ao listar emergências.</td></tr>';
    }
  }
  
  function renderEmergencias(data) {
    const resultsTable = document.querySelector("#consultas-emergencia-tbody");
  
    if (!resultsTable) {
      console.error('Elemento "tbody" não encontrado.');
      return;
    }
  
    resultsTable.innerHTML = ""; // Limpa a tabela antes de adicionar os novos dados
  
    if (!Array.isArray(data)) {
      console.error("Os dados fornecidos não são uma lista de emergências.");
      return;
    }
  
    data.forEach((emergencia) => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${emergencia.data || "Não disponível"}</td>
        <td>${
          emergencia.inicio && emergencia.fim
            ? `${emergencia.inicio} - ${emergencia.fim}`
            : "Não disponível"
        }</td>
        <td>${
          emergencia.doctor && emergencia.doctor.name
            ? emergencia.doctor.name
            : "Não disponível"
        }</td>
        <td>
          <button class="btn btn-danger" 
            onclick="removerProntidaoEmergencia('${emergencia.data}', '${emergencia.inicio}', '${emergencia.fim}', '${emergencia.doctor.email}')">
            <i class="bi bi-trash"></i> 
          </button>
        </td>
      `;
  
      console.log("Data:",emergencia.data, "horaInicio:",emergencia.inicio,  "horaFim:",emergencia.fim, "EmailDoctor:",emergencia.doctor.email);
      resultsTable.appendChild(row);
    });
  }
  








// Função para Remover Prontidão
  async function removerProntidaoEmergencia(data, inicio, fim, emailMedico) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }
  
    const prontidaoData = {
      data,
      inicio: `${inicio}`,
      fim: `${fim}`,
      emails_medico: [emailMedico],
    };
  
    const url = "https://crm-healthlink.onrender.com/api/prontidao";
  
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prontidaoData),
      });
  
      if (!response.ok) throw new Error(`Erro ao remover prontidão! Status: ${response.status}`);
  
      console.log("✅ Prontidão removida com sucesso!");
      alert("Prontidão removida com sucesso!");
      listarEmergencias(token); // Atualiza a lista após remover
  
    } catch (error) {
      console.error("❌ Erro ao remover prontidão:", error);
      alert("Erro ao remover prontidão!");
    }
  }
  