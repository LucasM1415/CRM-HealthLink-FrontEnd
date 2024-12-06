const formFuncionario = document.getElementById("criar-funcionario-form");

formFuncionario.addEventListener("submit",(e)=>{
  e.preventDefault();
  criarFuncionario();
})


async function criarFuncionario(){
  const resultDiv = document.getElementById("resultsEmployeeCreate");

  const employeeData = {
    name: document.getElementById("criar-funcionario-nome").value,
    birthDate: document.getElementById("criar-funcionario-data-nascimento").value,
    cpf: document.getElementById("criar-funcionario-cpf").value,
    email: document.getElementById("criar-funcionario-email").value,
    password: document.getElementById("criar-funcionario-password").value,
    office: document.getElementById("criar-funcionario-cargo").value,
    accessLevel: document.getElementById("criar-funcionario-cargo").value == "RECEPTIONIST" ? "ATTENDANT" : "MANAGER"
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
    document.getElementById("criar-funcionario-nome").value = "";
    document.getElementById("criar-funcionario-data-nascimento").value = "";
    document.getElementById("criar-funcionario-cpf").value = "";
    document.getElementById("criar-funcionario-email").value = "";
    const resultsDiv = document.getElementById("resultsCreate");
    resultsDiv.innerText = "";
    resultsDiv.className = "resultsCreate";
  }

