const cardDiaClassName = "cardDia"






async function mostraHorarios(day) {
    const details = document.getElementById("day-details");
    var especialidadeDoMedico = document.getElementById("specialty").value;
    var month = document.getElementById("month").value;
    var year = document.getElementById("year").value;

    var datas = await pegaDatasDisponives(document.getElementById('specialty').value.toUpperCase(),
    document.getElementById('selectAgendamentos').value.toUpperCase(),
    document.getElementById('month').value,
    document.getElementById('year').value);
    console.log(datas)

    var dataEscolhida = `${year}-${month}-${day}` 
    
    details.style.display = "block";
    document.getElementById("selected-day-info").innerHTML = `
                    <h3>Detalhes do Dia ${day}</h3>

                    
                    <label for="criar-consulta-datahora">Hora de inicio:</label>
                    <input type="time" id="Hora-de-inicio" name="Hora-de-inicio" required>

                    <label for="criar-consulta-datahora">Hora de termino:</label>
                    <input type="time" id="Hora-de-termino" name="Hora-de-termino" required>

                    <button onclick="cadastrarHorario(${day})">criar</button>
                    `;
  }

function gerarCardDia(qtd){
    const cards = []
    for(let i=1; i <= qtd;i++){
        let c = document.createElement('div')
        c.classList.add(cardDiaClassName);
        let p = document.createElement('p')
        p.textContent = i;
        c.appendChild(p)
        c.addEventListener("click", ()=>{
            let dia = String(i)
            
            mostraHorarios(dia.padStart(2,'0'));
        })
        cards.push(c)
    }
    return cards;

}

async function renderizarCalendario(mes,ano,local){
    const div = document.getElementById(local);
    div.innerHTML = ""
    const quantidadeDias = (new Date(ano, mes, 0)).getDate();
    
    const cards = gerarCardDia(quantidadeDias);

    cards.forEach(card => {
        div.appendChild(card)
    })
}

 async function pegaDatasDisponives(specialty,agendamento,month,year){
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token não encontrado no localStorage");
    return;
  }

  const url = `http://${ip}:8080/api/calendario/specialtyfordoctor?speciality=${specialty}&month=${month}&year=${year}&tipoAgendamento=${agendamento}`;

  try {
    const response =  await fetch(url, {
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




function renderizarGerenteCalendario(){
    
    renderizarCalendario(document.getElementById('month').value,document.getElementById('year').value,'calendar')
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
  
    const optionDefault = document.createElement("option");
    optionDefault.value = "";
    optionDefault.textContent = "Selecione uma especialidade";
    selectElement.appendChild(optionDefault);
  
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