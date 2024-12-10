const formFuncionario = document.getElementById("criar-funcionario-form");

formFuncionario.addEventListener("submit",(e)=>{
  e.preventDefault();
  if(e.target.dataset.mode == "update"){
    updateEmployee();
    
  }else{
    criarFuncionario();
  }
  e.target.reset()
  showEmployees();
})
async function updateEmployee() {
  const resultDiv = document.getElementById("resultsEmployeeCreate");

  const employeeData = {
    name: document.getElementById("criar-funcionario-nome").value,
    birthDate: document.getElementById("criar-funcionario-data-nascimento").value,
    cpf: document.getElementById("criar-funcionario-cpf").value,
    email: document.getElementById("criar-funcionario-email").value,
    password: document.getElementById("criar-funcionario-password").value,
    office: document.getElementById("criar-funcionario-cargo").value,
    acessLevel: document.getElementById("criar-funcionario-cargo").value == "RECEPTIONIST" ? "ATTENDANT" : "MANAGER"
  };

  const response = await fetch("https://crm-healthlink.onrender.com/api/employee", {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(employeeData) 
  });

  if(!response.ok){
    resultDiv.innerHTML = "Não atualizado"  
    return;
  }
  resultDiv.innerHTML = "Atualizado"
}

async function criarFuncionario(){
  const resultDiv = document.getElementById("resultsEmployeeCreate");

  const employeeData = {
    name: document.getElementById("criar-funcionario-nome").value,
    birthDate: document.getElementById("criar-funcionario-data-nascimento").value,
    cpf: document.getElementById("criar-funcionario-cpf").value,
    email: document.getElementById("criar-funcionario-email").value,
    password: document.getElementById("criar-funcionario-password").value,
    office: document.getElementById("criar-funcionario-cargo").value,
    acessLevel: document.getElementById("criar-funcionario-cargo").value == "RECEPTIONIST" ? "ATTENDANT" : "MANAGER"
  };

  const response = await fetch("https://crm-healthlink.onrender.com/api/employee/create/employee", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(employeeData) 
  });

  if(!response.ok){
    resultDiv.innerHTML = "Não criado"  
    return;
  }
  resultDiv.innerHTML = "criado"
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

function readInfoEmployee(picture, name, cargo,email) {
  document.getElementById("showNameFuncionario").value = name || "Nome não disponível";
  document.getElementById("showCargoFuncionario").value = cargo || "Cargo não disponível" ;
    document.getElementById("showEmailFuncionario").value = email || "CRM não disponível";

  // Se quiser usar a imagem no modal, descomente e ajuste:
  // const imgElement = document.querySelector('.img-read');
  // if (imgElement) imgElement.src = picture || './image/Profile Icon.webp';
}
function editEmployee(index, name, cargo,email) {

  document.getElementById("criar-funcionario-nome").value = name;
  // document.getElementById("criar-funcionario-cargo").value = cargo;
  document.getElementById("criar-funcionario-email").value = email;
  
  const form = document.getElementById("criar-funcionario-form");
  form.setAttribute("data-mode", "update");
  form.setAttribute("data-index", index);

  const submitButton = document.getElementById("newUserBtnFuncionario");
  submitButton.textContent = "Atualizar Funcionário";
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
        <td>${employee.email || "E-mail não disponível"}</td>
        <td>
          <button class="btn btn-success" 
            onclick="readInfoEmployee('${employee.picture}', '${employee.name}', '${employee.office}', '${employee.email}')" 
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
            data-bs-toggle="modal" data-bs-target="#employeeForm">
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
