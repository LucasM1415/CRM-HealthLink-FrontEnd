const cardDiaClassName = "cardDia";


async function cadastrarHorario(day) {
  let dia = String(day);

  var mes = document.getElementById('month').value;
  var ano = document.getElementById('year').value;
  var horainicio = document.getElementById("Hora-de-inicio").value;
  var horafinal = document.getElementById("Hora-de-termino").value
  var speciality = document.getElementById("selectSpeciality").value;
  var tipoagendamento = document.getElementById("selectAgendamentos").value
  var vagas = Math.abs(document.getElementById("quantidade-De-Vagas").value);
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  const url = `http://${ip}:8080/api/calendario`;

  const requestBody = {
    "date": `${ano}-${mes}-${dia.padStart(2, '0')}`,
    "homeTime": `${horainicio}:00`,
    "endTime": `${horafinal}:00`,
    "specialityType": speciality,
    "tipoAgendamento": tipoagendamento,
    "vagas": vagas
  }
    ;

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
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    alert("calendario criado com sucesso!");
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao criar calendario.");
  }
}

function mostraHorarios(day) {
  
  const details = document.getElementById("day-details");
  details.style.display = "block";
  document.getElementById("selected-day-info").innerHTML = `
    <h3>Detalhes do Dia ${day}</h3>
    <div class="form-row">
      <div class="field-group w-30">
        <label for="criar-consulta-datahora">Hora de inicio:</label>
        <input type="time" id="Hora-de-inicio" name="Hora-de-inicio" required>  
      </div>

      <div class="field-group w-30">
        <label for="criar-consulta-datahora">Hora de termino:</label>
        <input type="time" id="Hora-de-termino" name="Hora-de-termino" required>    
      </div>
    </div>
    
    <div class="form-row">
      <div class="field-group w-40">
        <label for="quantidadeDeVagas">Quantidade De Vagas:</label>
        <input class="w-50" type="number" id="quantidade-De-Vagas" min="1">
      </div>
    </div>
  
    <button onclick="cadastrarHorario(${day})">criar</button>
  `;
}

function gerarCardDia(qtd) {
  const cards = []
  for (let i = 1; i <= qtd; i++) {
    let c = document.createElement('div')
    c.classList.add(cardDiaClassName);
    let p = document.createElement('p')
    p.textContent = i;
    c.appendChild(p)
    c.addEventListener("click", () => {
      let dia = String(i)

      mostraHorarios(dia.padStart(2, '0'));
    })
    cards.push(c)
  }
  return cards;

}

async function renderizarCalendario(mes, ano, local) {
  const div = document.getElementById(local);
  div.innerHTML = ""
  const quantidadeDias = (new Date(ano, mes, 0)).getDate();

  const cards = gerarCardDia(quantidadeDias);

  cards.forEach(card => {
    div.appendChild(card)
  })
}
function renderizarGerenteCalendario() {
  renderizarCalendario(document.getElementById('month').value, document.getElementById('year').value, 'calendar')
}





async function preencherSelectTipoAgendamentos(selectId) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return;
  }

  const url = `http://${ip}:8080/api/employee/alltipoagendamentos`;

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

    const especialidades = await response.json();
    renderEspecialidadesSelectDeAgendamento(especialidades, selectId);
  } catch (error) {
    console.error("Erro ao preencher o select com especialidades:", error);
  }
}



function renderEspecialidadesSelectDeAgendamento(especialidades, selectId) {
  const selectElement = document.getElementById(selectId);

  if (!selectElement) {
    console.error("Elemento <select> não encontrado!");
    return;
  }

  selectElement.innerHTML = "";

  especialidades.forEach((especialidade) => {
    if (especialidade === "PRONTIDAO") {
      return; // Ignora a especialidade "PRONTIDAO"
    }
    const option = document.createElement("option");
    option.value = especialidade;
    option.textContent = especialidade || "Nome não disponível";
    selectElement.appendChild(option);
  });
}