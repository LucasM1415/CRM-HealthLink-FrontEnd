const cardMedicoDisponibilidadeClassName = "cardMedicoDisponibilidade";
const containerPacienteMarcarConsultaClassName = "pacienteMarcarConsultaContainer";
const emailPaciente = "patient@email.com";

class DisponibilidadeMedico{
    constructor(data,inicio,fim,especialidade,tipoAgendamento,nomeMedico,emailMedico){
        this.data = data;
        this.inicio = inicio;
        this.fim = fim;
        this.especialidade = especialidade;
        this.tipoAgendamento = tipoAgendamento;
        this.nomeMedico = nomeMedico;
        this.emailMedico = emailMedico
    }

}

//recebe uma lista com cada disponibilidade
//retorna um card
const cardMedicoDisponibilidade = (disponibilidadesMedico)=>{
    let card = document.createElement("div");
    let h3NomeMedico = document.createElement("h3");
    h3NomeMedico.textContent = disponibilidadesMedico[0].nomeMedico;

    card.classList.add(cardMedicoDisponibilidadeClassName);
    card.appendChild(h3NomeMedico);   

    disponibilidadesMedico.forEach(disponibilidade => {
        let span = document.createElement("span");
        span.textContent = `${disponibilidade.inicio} - ${disponibilidade.fim}`;
        span.onclick = ()=>{marcarConsulta(disponibilidade)};
        card.appendChild(span)
    });

    return card;
}

async function popularPacienteMarcarConsulta(){
    if(localStorage.getItem("token") == null){
        window.location.href= "/pages/login.html";
    }
    document.getElementsByClassName(containerPacienteMarcarConsultaClassName)[0].innerHTML = ""
    const response = await fetch(`http://localhost:8080/api/calendario/disponibilidades/${localStorage.getItem("especialidade")}/${localStorage.getItem("tipoAgendamento")}`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Accept': 'application/json',
        },
      }
    );
    const disponibilidadesMedico = (await response.json()).map(d =>{
        return new DisponibilidadeMedico(d.date,d.homeTime,d.endTime,d.specialityType,d.tipoAgendamento,d.nomeMedico,d.emailMedico);
    });

    medicoDisponibilidade = {};
    const disponibilidadesDividoPorMedico = disponibilidadesMedico.forEach(d => {
        if(medicoDisponibilidade[d.nomeMedico] == undefined){
            medicoDisponibilidade[d.nomeMedico] = [];
        }
        medicoDisponibilidade[d.nomeMedico].push(d);
    })

    for(let medico in medicoDisponibilidade){
        let card = cardMedicoDisponibilidade(medicoDisponibilidade[medico]);
        document.getElementsByClassName(containerPacienteMarcarConsultaClassName)[0].appendChild(card);
    }
    
    if(disponibilidadesMedico.length == 0){
        let h1 = document.createElement("h1")
        h1.textContent = "Nada encontrado"
        document.getElementsByClassName(containerPacienteMarcarConsultaClassName)[0].appendChild(h1);
    }
}

