// const formFuncionario = document.getElementById("criar-funcionario-form");

// formFuncionario.addEventListener("submit",(e)=>{
//   e.preventDefault();
//   if(e.target.dataset.mode == "update"){
//     updateEmployee();
    
//   }else{
//     criarFuncionario();
//   }
//   e.target.reset()
//   showEmployees();
// })


function editEmployee(index, name, cargo, email) {

  document.getElementById("update-funcionario-nome").value = name;
  document.getElementById("update-funcionario-cargo").value = cargo;
  document.getElementById("update-funcionario-email").value = email;
  
  const form = document.getElementById("employeeUpdateForm");
  form.setAttribute("data-mode", "update");
  form.setAttribute("data-index", index);

  const submitButton = document.getElementById("newUserBtnFuncionario");
  submitButton.textContent = "Atualizar Funcionário";
}


// Formulário de Criação
const formFuncionarioCreate = document.getElementById("criar-funcionario-form");
formFuncionarioCreate.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  if (e.target.dataset.mode === "update") {
    await updateEmployee();  
  } else {
    await criarFuncionario(); 
  }

  e.target.reset();
  showEmployees();
});

// Formulário de Atualização
const formFuncionarioUpdate = document.getElementById("update-funcionario-form");
formFuncionarioUpdate.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  if (e.target.dataset.mode === "update") {
    await criarFuncionario(); 
  } else {
    await updateEmployee();  
  }

  e.target.reset();
  showEmployees();
});


async function updateEmployee() {

  const employeeData = {
    name: document.getElementById("update-funcionario-nome").value,
    birthDate: document.getElementById("update-funcionario-data-nascimento").value,
    cpf: document.getElementById("update-funcionario-cpf").value,
    email: document.getElementById("update-funcionario-email").value,
    password: document.getElementById("update-funcionario-password").value,
    office: document.getElementById("update-funcionario-cargo").value,
    acessLevel: document.getElementById("update-funcionario-cargo").value == "RECEPTIONIST" ? "ATTENDANT" : "MANAGER"
  };

  try {
    const response = await fetch("https://crm-healthlink.onrender.com/api/employee", {
      method: "PUT",
      headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(employeeData) 
  });

  if(!response.ok){
    const errorText = await response.text();
    throw new Error(
      `Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`
    );
  }

  showEmployees();
  handleUpdateEmployeeResult("success");
  } catch (error) {
    console.error("Erro na requisição:", error);
    handleUpdateEmployeeResult("error");
  }
}

async function handleUpdateEmployeeResult(status) {
  const resultsDiv = document.getElementById("resultsEmployeeUpdate");
  resultsDiv.className = "resultsEmployeeUpdate";
  const token = localStorage.getItem("token");

  switch (status) {
    case "success":
      resultsDiv.innerText = "Funcionário atualizado com sucesso!";
      resultsDiv.classList.add("success");

      if (token) {
        await showEmployees();
      }

      setTimeout(() => {
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsEmployeeUpdate";
      }, 3000);
      break;

    case "error":
      resultsDiv.innerText = "Erro ao atualizar funcionário!";
      resultsDiv.classList.add("error");

      if (token) {
        await showEmployees();
      }

      setTimeout(() => {
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsEmployeeUpdate";
      }, 3000);
      break;

    default:
      resultsDiv.innerText = "Status desconhecido!";
      resultsDiv.classList.add("error");

      setTimeout(() => {
        document.getElementById("update-funcionario-cpf").value = "";
        document.getElementById("update-funcionario-email").value = "";
        document.getElementById("update-funcionario-nome").value = "";
        document.getElementById("update-funcionario-data-nascimento").value = "";
        document.getElementById("update-funcionario-cargo").value = "";
        document.getElementById("update-funcionario-password").value = "";
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsEmployeeUpdate";
      }, 3000);
      break;
  }
}

async function criarFuncionario(){

  const employeeData = {
    name: document.getElementById("criar-funcionario-nome").value,
    birthDate: document.getElementById("criar-funcionario-data-nascimento").value,
    cpf: document.getElementById("criar-funcionario-cpf").value,
    email: document.getElementById("criar-funcionario-email").value,
    password: document.getElementById("criar-funcionario-password").value,
    office: document.getElementById("criar-funcionario-cargo").value,
    acessLevel: document.getElementById("criar-funcionario-cargo").value == "RECEPTIONIST" ? "ATTENDANT" : "MANAGER"
  };

  try {
    const response = await fetch("https://crm-healthlink.onrender.com/api/employee/create/employee", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(employeeData) 
    });
    
    if(!response.ok){
      const errorText = await response.text();
      throw new Error(
        `Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`
      );
    }

  showEmployees();
  handleCreateEmployeeResult("success");
  } catch  (error) {
    console.error("Erro na requisição:", error);
    handleCreateEmployeeResult("error");
  }
}

async function handleCreateEmployeeResult(status) {
  const resultsDiv = document.getElementById("resultsEmployeeCreate");
  resultsDiv.className = "resultsEmployeeCreate";
  const token = localStorage.getItem("token");

  switch (status) {
    case "success":
      resultsDiv.innerText = "Funcionário criado com sucesso!";
      resultsDiv.classList.add("success");

      if (token) {
        await showEmployees();
      }

      setTimeout(() => {
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsEmployeeUpdate";
      }, 3000);
      break;

    case "error":
      resultsDiv.innerText = "Erro ao criar funcionário!";
      resultsDiv.classList.add("error");

      if (token) {
        await showEmployees();
      }

      setTimeout(() => {
        resultsDiv.innerText = "";
        resultsDiv.className = "resultsEmployeeCreate";
      }, 3000);
      break;

    default:
      resultsDiv.innerText = "Status desconhecido!";
      resultsDiv.classList.add("error");
      break;
  }
}



function limparCamposEmployee() {
  const resultsDiv = document.getElementById("resultsCreate");
  if (resultsDiv) {
    resultsDiv.className = "resultsCreate";
    resultsDiv.innerText = "";
  }

  const form = document.getElementById("criar-funcionario-form");
  if (form) {
    form.reset();
  }
  const newUserBtnFuncionario = document.getElementById("newUserBtnFuncionario");
  if(newUserBtnFuncionario){
    newUserBtnFuncionario.textContent = "Criar Funcionário"
  }
}

function readInfoEmployee(picture, name, cargo, cpf, email) {
  document.getElementById("showNameFuncionario").value = name || "Nome não disponível";
  document.getElementById("showCargoFuncionario").value = cargo || "Cargo não disponível" ;
  document.getElementById("showCPFFuncionario").value = cpf || "CPF não disponível" ;
  document.getElementById("showEmailFuncionario").value = email || "CRM não disponível";

  // Se quiser usar a imagem no modal, descomente e ajuste:
  // const imgElement = document.querySelector('.img-read');
  // if (imgElement) imgElement.src = picture || './image/Profile Icon.webp';
}



function formatCPF(cpf) {
  if (cpf.length === 11) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf; // Retorna o CPF original se o formato não for válido
}


async function showEmployees() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/employee`; 
    
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

    const employees = await response.json();
    renderEmployees(employees);
  } catch (error) {
    console.error("Erro na requisição:", error);
    const employeeTableBody = document.querySelector("#employeeTableBody");
    employeeTableBody.innerHTML =
      '<tr><td colspan="8">Erro ao listar funcionários.</td></tr>';
  }
}


function renderEmployees(employees) {
  const employeeTableBody = document.querySelector("#employeeTableBody");
  const acessLevel = localStorage.getItem("acessLeval");

  if (!employeeTableBody) {
    console.error("Elemento com ID 'employeeTableBody' não encontrado.");
    return;
  }

  employeeTableBody.innerHTML = "";

  if (!Array.isArray(employees)) {
    console.error("Os dados fornecidos não são uma lista de funcionários.");
    return;
  }

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const localDate = new Date(year, month - 1, day); // Ignora timezone
    return localDate.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  employees.forEach((employee, index) => {
    const commonRowContent = `
      <tr class="doctorDetails">
        <td>${index + 1}</td>
        <td>${employee.name || "Nome não disponível"}</td>
        <td>${employee.office}</td>
        <td>${formatCPF(employee.cpf)}</td>
        <td>${employee.email || "E-mail não disponível"}</td>
        <td>
          <button class="btn btn-success" 
            onclick="readInfoEmployee('${employee.picture}', '${employee.name}', '${employee.office}', '${formatCPF(employee.cpf)}','${employee.email}')" 
            data-bs-toggle="modal" data-bs-target="#readDataFuncionario">
            <i class="bi bi-eye"></i>
          </button>
    `;

    let row;

    if (acessLevel === "ATTENDANT") {
      row = `${commonRowContent}</td></tr>`;
    } else if (acessLevel === "MANAGER") {
      row = `
        ${commonRowContent}
          <button class="btn btn-primary" 
            onclick="editEmployee(${index}, '${employee.name}', '${employee.cargo}', '${employee.email}')"
            data-bs-toggle="modal" data-bs-target="#employeeUpdateForm">
            <i class="bi bi-pencil-square"></i>
          </button>
        </td>
      </tr>`;
    } else {
      console.warn("Nível de acesso desconhecido:", acessLevel);
      return; // Caso o nível de acesso não seja reconhecido, não renderiza a linha
    }

    employeeTableBody.innerHTML += row;
  });
}



document.getElementById("userSearchFuncionario").addEventListener("show.bs.modal", () => {
  document.getElementById("searchEmailFuncionarioInput").value = "";
  clearFuncionarioResults();
});

async function buscarFuncionario(token, emailFuncionario) {
  if (!token) {
      alert("Usuário não autenticado.");
      return;
  }

  const url = `https://crm-healthlink.onrender.com/api/employee/${emailFuncionario}`;

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
      renderFuncionario(data);
  } catch (error) {
      console.error("Erro na requisição:", error);
      handleSearchResultFuncionario("error", "Erro ao buscar funcionário!");
  }
}

function handleSearchResultFuncionario(status, message) {
  const resultsDiv = document.getElementById("resultsGetFuncionario");
  resultsDiv.className = "mt-3 resultsGet"; 

  switch (status) {
      case "success":
          resultsDiv.innerText = message || "Funcionário encontrado com sucesso!";
          resultsDiv.classList.add("success");
          break;

      case "error":
          resultsDiv.innerText = message || "Erro ao buscar funcionário!";
          resultsDiv.classList.add("error");
          break;

      default:
          resultsDiv.innerText = message || "Status desconhecido!";
          resultsDiv.classList.add("error");
          break;
  }
}

function renderFuncionario(data) {
  const resultsDiv = document.getElementById("resultsGetFuncionario");
  resultsDiv.innerHTML = "";

  const formatDate = (dateString) => {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
  };

  if (data) {
      resultsDiv.innerHTML = `
          <p><strong>Nome:</strong> ${data.name || "Nome não disponível"}</p>
          <p><strong>Data de Nascimento:</strong> ${data.birthDate
              ? formatDate(data.birthDate)
              : "Data de Nascimento não disponível"}</p>
          <p><strong>Cargo:</strong> ${data.office || "Departamento não disponível"}</p>
          <p><strong>Email:</strong> ${data.email || "Email não disponível"}</p>
      `;
  } else {
      resultsDiv.innerHTML = `<p>Nenhum funcionário encontrado.</p>`;
  }
}

function clearFuncionarioResults() {
  const resultsDiv = document.getElementById("resultsGetFuncionario");
  if (resultsDiv) {
      resultsDiv.innerHTML = "";
  }
}

document.querySelector(".searchConfirmFuncionario").addEventListener("click", () => {
  const token = localStorage.getItem("token");
  const emailFuncionario = document.getElementById("searchEmailFuncionarioInput").value.trim();

  if (emailFuncionario) {
      buscarFuncionario(token, emailFuncionario);
  } else {
      alert("Por favor, insira um e-mail válido.");
  }
});