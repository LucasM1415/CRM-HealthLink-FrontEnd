const cardDiaClassName = "cardDia";


function cadastrarHorario(index, data, day) {
  var tempo_medio = document.getElementById(`tempo-medio-${index}`).value;
  var Hora_de_inicio = ajustarFormatoHora(document.getElementById(`Hora-de-inicio-${index}`).value);
  var Hora_de_termino = ajustarFormatoHora(document.getElementById(`Hora-de-termino-${index}`).value);
  var especialidade_Medico = document.getElementById("specialty").value.toUpperCase();
  var tipo_agendamento = document.getElementById('selectAgendamentos').value.toUpperCase();
  var crm = localStorage.getItem("crm");



  var datas = {
    "date": data,
    "homeTime": Hora_de_inicio,
    "endTime": Hora_de_termino,
    "specialityType": especialidade_Medico,
    "tipoAgendamento": tipo_agendamento,
    "crm": crm,
    "tempoMedioConsultaMinutos": parseInt(tempo_medio)
  };


  var token = localStorage.getItem("token");
  fetch('https://crm-healthlink.onrender.com/api/calendario/associateDoctor', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datas)
  })
    .then(response => {
      if (response.ok) {
        alert("Associação realizada com sucesso!");
        reiniciarPagina();
        return response.text();
      } else {
        throw new Error('Erro na requisição: ' + response.statusText);
      }
    })
    .then(message => {
      mostraHorarios(day);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

function reiniciarPagina() {
  location.reload();
}

function ajustarFormatoHora(hora) {
  if (hora && hora.match(/^\d{2}:\d{2}$/)) {
    return hora + ":00";
  }
  return hora; // Retorna o valor original se já estiver no formato correto
}



async function mostraHorarios(day) {
  const details = document.getElementById("day-details");
  var especialidade_Medico = document.getElementById("specialty").value.toUpperCase();
  var tipo_agendamento = document.getElementById('selectAgendamentos').value.toUpperCase();
  var month = document.getElementById("month").value;
  var year = document.getElementById("year").value;

  var datas = await pegaDatasDisponives(
    especialidade_Medico,
    tipo_agendamento,
    month,
    year
  );

  const dataEscolhida = `${year}-${month}-${day}`;

  for(var x in datas){
    if(datas[x].date === dataEscolhida){

    }
    console.log(datas[x].date)
    //console.log(dataEscolhida)
  }
  var agendamentosFiltrados = datas.filter(agendamento => agendamento.date === dataEscolhida);


  console.log(agendamentosFiltrados)
  if (agendamentosFiltrados.length === 0) {
    
    renderizarGerenteCalendario();
    const details = document.getElementById("day-details");
    details.style.display = "none";
  }


  if (agendamentosFiltrados.length > 0) {
    details.style.display = "block";
    const horariosHtml = agendamentosFiltrados.map((agendamento, index) => `
      <div class="horario-bloco">
        <h4 class="marginTop">Agendamento ${index + 1}</h4>
        <label class="marginTop marginTop" for="Hora-de-inicio-${index}">Hora de início:</label>
        <input class="marginTop" type="time" id="Hora-de-inicio-${index}" name="Hora-de-inicio-${index}" value="${agendamento.homeTime}" required>
        <br>
        <label class="marginTop" for="Hora-de-termino-${index}">Hora de término:</label>
        <input class="marginTop" type="time" id="Hora-de-termino-${index}" name="Hora-de-termino-${index}" value="${agendamento.endTime}" required>
        <br>
        <label class="marginTop" for="quantidadeDeVagas">Tempo medio de consulta:</label>
        <input type="number" id="tempo-medio-${index}" value = 10 min="1" class="imputNumber marginTop">
        <br>
        <button class="button marginTop" onclick="cadastrarHorario(${index},'${dataEscolhida}','${day}')">Criar</button>
      </div>
    `).join("");

    document.getElementById("selected-day-info").innerHTML = `
      <h3>Detalhes do Dia ${day}</h3>
      ${horariosHtml}
    `;
  } else if (agendamentosFiltrados.date != dataEscolhida) {
    details.style.display = "none";
  }
}


async function gerarCardDia(qtd) {
  const especialidade_Medico = document.getElementById("specialty").value.toUpperCase();
  const tipo_agendamento = document.getElementById('selectAgendamentos').value.toUpperCase();
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;

  // Pega os dias destacados (disponíveis)
  const listDays = await pegaDias(especialidade_Medico, tipo_agendamento, month, year);

  // Determina o primeiro dia da semana do mês
  const primeiroDiaSemana = new Date(year, month - 1, 1).getDay(); // 0 = domingo, 1 = segunda, etc.

  const cards = [];
 

  // Adiciona placeholders (dias vazios) no início
  for (let i = 0; i < primeiroDiaSemana; i++) {
    let placeholder = document.createElement('div');
    placeholder.classList.add(cardDiaClassName);
    placeholder.style.visibility = "hidden"; // Esconde o placeholder
    cards.push(placeholder);
  }

  // Gera os dias do mês
  for (let i = 1; i <= qtd; i++) {
    let c = document.createElement('div');
    c.classList.add(cardDiaClassName);

    let p = document.createElement('p');
    p.textContent = i; // Número do dia
    c.appendChild(p);

    // Se o dia estiver na lista de "disponíveis", destaque
    if (listDays.includes(i)) {
      c.classList.add('highlighted');
    }

    // Adiciona evento de clique para mostrar horários
    c.addEventListener("click", () => {
      let dia = String(i);
      mostraHorarios(dia.padStart(2, '0')); // Formata com zero à esquerda, se necessário
    });

    cards.push(c);
  }

  // Calcula os placeholders no final para completar a última linha
  const totalCelas = cards.length;
  const diasExtras = totalCelas % 7 === 0 ? 0 : 7 - (totalCelas % 7);

  for (let i = 0; i < diasExtras; i++) {
    let placeholder = document.createElement('div');
    placeholder.classList.add(cardDiaClassName);
    placeholder.style.visibility = "hidden"; // Esconde o placeholder
    cards.push(placeholder);
  }

  return cards;
}


async function pegaDias(specialty, agendamento, month, year) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return [];
  }

  const url = new URL(`https://crm-healthlink.onrender.com/api/calendario/listofdays`);
  url.searchParams.append("speciality", specialty);
  url.searchParams.append("month", month);
  url.searchParams.append("year", year);
  url.searchParams.append("tipoAgendamento", agendamento);

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
    return data;
  } catch (error) {
    return [];
  }
}


async function renderizarCalendario(mes, ano, local) {
  const div = document.getElementById(local);
  div.innerHTML = "";
  const quantidadeDias = new Date(ano, mes, 0).getDate();

  try {
    const cards = await gerarCardDia(quantidadeDias);
    cards.forEach((card) => {
      div.appendChild(card);
    });
    
    } catch (error) {
    console.error("Erro ao gerar cards do calendário:", error);
  }
}


async function pegaDatasDisponives(specialty, agendamento, month, year) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return;
  }

  const url = new URL(`https://crm-healthlink.onrender.com/api/calendario/specialtyfordoctor`);

  url.searchParams.append("speciality", specialty);
  url.searchParams.append("month", month);
  url.searchParams.append("year", year);
  url.searchParams.append("tipoAgendamento", agendamento);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }).then(res => res.json());
    if (!response) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Erro ao preencher o select com especialidades:", error);
  }
}




function renderizarGerenteCalendario() {
  renderizarCalendario(document.getElementById('month').value, document.getElementById('year').value, 'calendar');
  
}





async function preencherSelectTipoAgendamentos(selectId) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return;
  }

  const url = `https://crm-healthlink.onrender.com/api/employee/alltipoagendamentos`;

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

document.addEventListener("DOMContentLoaded", () => {
  preencherSelectTipoAgendamentos("selectAgendamentos");
});