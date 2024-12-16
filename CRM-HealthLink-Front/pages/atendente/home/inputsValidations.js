// Validação de Pacientes
const nomeInput = document.getElementById("criar-paciente-nome"); // Nome - Apenas letras e espaços
nomeInput.addEventListener("input", function () {
  const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*[A-Za-zÀ-ÖØ-öø-ÿ]+[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/;
  if (nomeRegex.test(nomeInput.value.trim())) {
    nomeInput.classList.remove("is-invalid");
    nomeInput.classList.add("is-valid");
  } else {
    nomeInput.classList.remove("is-valid");
    nomeInput.classList.add("is-invalid");
  }
});

const dataInput = document.getElementById("criar-paciente-data-nascimento"); // Data de Nascimento - Não pode estar em branco
dataInput.addEventListener("input", function () {
  if (dataInput.value) {
    dataInput.classList.remove("is-invalid");
    dataInput.classList.add("is-valid");
  } else {
    dataInput.classList.remove("is-valid");
    dataInput.classList.add("is-invalid");
  }
});

const cpfInput = document.getElementById("criar-paciente-cpf"); // CPF - Apenas números e exatamente 11 caracteres com formatação
cpfInput.addEventListener("input", function () {
  const cpfRaw = cpfInput.value.replace(/\D/g, ""); 
  const cpfRegex = /^\d{11}$/;

  cpfInput.value = cpfRaw
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  if (cpfRegex.test(cpfRaw)) {
    cpfInput.classList.remove("is-invalid");
    cpfInput.classList.add("is-valid");
  } else {
    cpfInput.classList.remove("is-valid");
    cpfInput.classList.add("is-invalid");
  }
});

const emailInput = document.getElementById("criar-paciente-email"); // E-mail - Deve ser válido
emailInput.addEventListener("input", function () {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(emailInput.value.trim())) {
    emailInput.classList.remove("is-invalid");
    emailInput.classList.add("is-valid");
  } else {
    emailInput.classList.remove("is-valid");
    emailInput.classList.add("is-invalid");
  }
});

const senhaInput = document.getElementById("criar-paciente-password"); // Senha - Mínimo 3 caracteres
senhaInput.addEventListener("input", function () {
  if (senhaInput.value.length >= 3) {
    senhaInput.classList.remove("is-invalid");
    senhaInput.classList.add("is-valid");
  } else {
    senhaInput.classList.remove("is-valid");
    senhaInput.classList.add("is-invalid");
  }
});



// Validação de Médico
const nomeInputDoctor = document.getElementById("criar-doutor-nome"); // Nome - Apenas letras e espaços, sem espaços isolados
nomeInputDoctor.addEventListener("input", function () {
  const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*[A-Za-zÀ-ÖØ-öø-ÿ]+[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/; // Regex para permitir apenas letras e espaços
  if (nomeRegex.test(nomeInputDoctor.value.trim())) {
    nomeInputDoctor.classList.remove("is-invalid");
    nomeInputDoctor.classList.add("is-valid");
  } else {
    nomeInputDoctor.classList.remove("is-valid");
    nomeInputDoctor.classList.add("is-invalid");
  }
});

const dataNascimentoInputDoctor = document.getElementById("criar-doutor-data-nascimento"); // Data de Nascimento - Não pode estar em branco
dataNascimentoInputDoctor.addEventListener("input", function () {
  if (dataNascimentoInputDoctor.value.trim() === "") {
    dataNascimentoInputDoctor.classList.remove("is-valid");
    dataNascimentoInputDoctor.classList.add("is-invalid");
  } else {
    dataNascimentoInputDoctor.classList.remove("is-invalid");
    dataNascimentoInputDoctor.classList.add("is-valid");
  }
});


const cpfInputDoctor = document.getElementById("criar-doutor-cpf"); // CPF - Apenas números, 11 caracteres
cpfInputDoctor.addEventListener("input", function () {
  const cpfRegex = /^\d{11}$/;
  if (cpfRegex.test(cpfInputDoctor.value.trim())) {
    cpfInputDoctor.classList.remove("is-invalid");
    cpfInputDoctor.classList.add("is-valid");
  } else {
    cpfInputDoctor.classList.remove("is-valid");
    cpfInputDoctor.classList.add("is-invalid");
  }
});

const crmInput = document.getElementById("criar-doutor-crm"); // CRM - Apenas números e uma sigla do estado, no formato 12345-PE
crmInput.addEventListener("input", function () {
  const crmRegex = /^\d{5}-[A-Z]{2}$/;
  if (crmRegex.test(crmInput.value.trim())) {
    crmInput.classList.remove("is-invalid");
    crmInput.classList.add("is-valid");
  } else {
    crmInput.classList.remove("is-valid");
    crmInput.classList.add("is-invalid");
  }
});

const emailInputDoctor = document.getElementById("criar-doutor-email"); // E-mail - Deve ser válido
emailInputDoctor.addEventListener("input", function () {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(emailInputDoctor.value.trim())) {
    emailInputDoctor.classList.remove("is-invalid");
    emailInputDoctor.classList.add("is-valid");
  } else {
    emailInputDoctor.classList.remove("is-valid");
    emailInputDoctor.classList.add("is-invalid");
  }
});

const senhaInputDoctor = document.getElementById("criar-doutor-password"); // Senha - No mínimo 3 caracteres
senhaInputDoctor.addEventListener("input", function () {
  if (senhaInputDoctor.value.trim().length >= 3) {
    senhaInputDoctor.classList.remove("is-invalid");
    senhaInputDoctor.classList.add("is-valid");
  } else {
    senhaInputDoctor.classList.remove("is-valid");
    senhaInputDoctor.classList.add("is-invalid");
  }
});



// Validação de Consulta
const dataConsulta = document.getElementById("consulta-data"); // Campo de data
dataConsulta.addEventListener("input", function () {
  if (dataConsulta.value.trim() === "") {
    dataConsulta.classList.remove("is-valid");
    dataConsulta.classList.add("is-invalid");
  } else {
    dataConsulta.classList.remove("is-invalid");
    dataConsulta.classList.add("is-valid");
  }
});



// Validação de Funcionário
const nomeInputFuncionario = document.getElementById("criar-funcionario-nome"); // Nome - Apenas letras e espaços, sem espaços isolados
nomeInputFuncionario.addEventListener("input", function () {
  const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*[A-Za-zÀ-ÖØ-öø-ÿ]+[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/;
  if (nomeRegex.test(nomeInputFuncionario.value.trim())) {
    nomeInputFuncionario.classList.remove("is-invalid");
    nomeInputFuncionario.classList.add("is-valid");
  } else {
    nomeInputFuncionario.classList.remove("is-valid");
    nomeInputFuncionario.classList.add("is-invalid");
  }
});

const dataNascimentoFuncionario = document.getElementById("criar-funcionario-data-nascimento"); // Data de Nascimento - Não pode estar em branco
dataNascimentoFuncionario.addEventListener("input", function () {
  if (dataNascimentoFuncionario.value.trim() === "") {
    dataNascimentoFuncionario.classList.remove("is-valid");
    dataNascimentoFuncionario.classList.add("is-invalid");
  } else {
    dataNascimentoFuncionario.classList.remove("is-invalid");
    dataNascimentoFuncionario.classList.add("is-valid");
  }
});

const cpfInputFuncionario = document.getElementById("criar-funcionario-cpf"); // CPF - Apenas números, com 11 caracteres
cpfInputFuncionario.addEventListener("input", function () {
  const cpfRegex = /^\d{11}$/;
  if (cpfRegex.test(cpfInputFuncionario.value.trim())) {
    cpfInputFuncionario.classList.remove("is-invalid");
    cpfInputFuncionario.classList.add("is-valid");
  } else {
    cpfInputFuncionario.classList.remove("is-valid");
    cpfInputFuncionario.classList.add("is-invalid");
  }
});

const emailInputFuncionario = document.getElementById("criar-funcionario-email"); // E-mail - Validação de formato de e-mail
emailInputFuncionario.addEventListener("input", function () {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(emailInputFuncionario.value.trim())) {
    emailInputFuncionario.classList.remove("is-invalid");
    emailInputFuncionario.classList.add("is-valid");
  } else {
    emailInputFuncionario.classList.remove("is-valid");
    emailInputFuncionario.classList.add("is-invalid");
  }
});

const senhaInputFuncionario = document.getElementById("criar-funcionario-password"); // Senha - Mínimo de 3 caracteres
senhaInputFuncionario.addEventListener("input", function () {
  if (senhaInputFuncionario.value.length >= 3) {
    senhaInputFuncionario.classList.remove("is-invalid");
    senhaInputFuncionario.classList.add("is-valid");
  } else {
    senhaInputFuncionario.classList.remove("is-valid");
    senhaInputFuncionario.classList.add("is-invalid");
  }
});
