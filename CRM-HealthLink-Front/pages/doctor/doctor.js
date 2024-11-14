const cardDiaClassName = "cardDia";



function cadastrarHorario(index,data,day) {
  var tempo_medio = document.getElementById(`tempo-medio-${index}`).value;
  var Hora_de_inicio = document.getElementById(`Hora-de-inicio-${index}`).value;
  var Hora_de_termino = document.getElementById(`Hora-de-termino-${index}`).value;
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

  // Exibir dados para confirmação
  console.log(datas);

  var token = localStorage.getItem("token");
  // Enviar requisição PUT
  fetch('http://localhost:8080/api/calendario/associateDoctor', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datas)
  })
  .then(response => {
    // Verifique se a resposta tem corpo
    if (response.ok) {
      return response.text();  // Converte a resposta para texto
    } else {
      throw new Error('Erro na requisição: ' + response.statusText);
    }
  })
  .then(message => {
    // A resposta agora é uma string
    mostraHorarios(day);
  })
  .catch(error => {
    console.error('Erro:', error);
  });
  
}



async function mostraHorarios(day) {
  const details = document.getElementById("day-details");
  var especialidade_Medico = document.getElementById("specialty").value.toUpperCase();
  var tipo_agendamento = document.getElementById('selectAgendamentos').value.toUpperCase();
  var month = document.getElementById("month").value;
  var year = document.getElementById("year").value;

  // Obter datas disponíveis
  var datas = await pegaDatasDisponives(
    especialidade_Medico,
    tipo_agendamento,
    month,
    year
  );

  // Formatar a data escolhida
  const dataEscolhida = `${year}-${month}-${day}`;

  // Filtrar agendamentos pela data escolhida
  const agendamentosFiltrados = datas.filter(agendamento => agendamento.date === dataEscolhida);

  // Verifica se existem agendamentos filtrados
  if (agendamentosFiltrados.length > 0) {
    // Exibe blocos de horários dos agendamentos
    details.style.display = "block";
    const horariosHtml = agendamentosFiltrados.map((agendamento, index) => `
      <div class="horario-bloco">
        <h4>Agendamento ${index + 1}</h4>
        <label for="Hora-de-inicio-${index}">Hora de início:</label>
        <input type="time" id="Hora-de-inicio-${index}" name="Hora-de-inicio-${index}" value="${agendamento.homeTime}" required>
        
        <label for="Hora-de-termino-${index}">Hora de término:</label>
        <input type="time" id="Hora-de-termino-${index}" name="Hora-de-termino-${index}" value="${agendamento.endTime}" required>
        
        <label for="quantidadeDeVagas">Tempo medio de consulta:</label>
                <input type="number" id="tempo-medio-${index}" value = 10 min="1">
        
        <button onclick="cadastrarHorario(${index},'${dataEscolhida}','${day}')">Criar</button>
        
        

      </div>
    `).join("");

    // Insere o HTML gerado no elemento
    document.getElementById("selected-day-info").innerHTML = `
      <h3>Detalhes do Dia ${day}</h3>
      ${horariosHtml}
    `;
  } else if (agendamentosFiltrados.date != dataEscolhida) {
    // Exibe entrada manual de horário caso não existam agendamentos
    details.style.display = "block";
    document.getElementById("selected-day-info").innerHTML = `
                      <h3>Detalhes do Dia ${day}</h3>

                      <label for="criar-consulta-datahora">Não a disponibilidade </label>
    `;
  }
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

async function pegaDatasDisponives(specialty, agendamento, month, year) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return;
  }

  const url = new URL(`http://${ip}:8080/api/calendario/specialtyfordoctor`);

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
    renderEspecialidadesSelect(especialidades, selectId);
  } catch (error) {
    console.error("Erro ao preencher o select com especialidades:", error);
  }
}



function renderEspecialidadesSelect(especialidades, selectId) {
  const selectElement = document.getElementById(selectId);

  if (!selectElement) {
    console.error("Elemento <select> não encontrado!");
    return;
  }

  selectElement.innerHTML = "";

  

  especialidades.forEach((especialidade) => {
    const option = document.createElement("option");
    option.value = especialidade;

    option.textContent = especialidade || "Nome não disponível";
    selectElement.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  preencherSelectTipoAgendamentos("selectAgendamentos");
});