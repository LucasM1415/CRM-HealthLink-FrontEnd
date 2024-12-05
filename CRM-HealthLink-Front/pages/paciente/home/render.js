const especialidades = async ()=>{
    const response = await fetch("https://crm-healthlink.onrender.com/api/employee/allspecialities", {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Accept': 'application/json',
          }
    });

    const especialidades = await response.json();
    const selectEspecialidade = document.getElementById("especialidadeSelect");

    especialidades.forEach(especialidade => {
        let option = document.createElement("option")
        option.value = especialidade;
        option.textContent = especialidade;
        selectEspecialidade.appendChild(option);
    });

}
const minhasConsultas = async ()=> {
    const response = await fetch(`https://crm-healthlink.onrender.com/api/patient/appointments/${localStorage.getItem("email")}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Accept': 'application/json',
          }
    });

    const consultas = await response.json();
    const ul = document.getElementById("appointments-list")
    console.log(consultas)
    consultas.forEach(consulta=>{
        let li = document.createElement('li')
        let pHorario = document.createElement('p')
        let pMedicoEspecialidade = document.createElement('p')
        pHorario.textContent = `${consulta["inicio"]} - ${consulta["fim"]}`
        pMedicoEspecialidade.textContent = ` Médico: ${consulta["nameDoctor"]} / ${consulta["speciality"]}`
        li.appendChild(pMedicoEspecialidade)
        li.appendChild(pHorario)
        ul.appendChild(li);
    })
}

function iniciarTelaPaciente(){
    especialidades();
    minhasConsultas();
}

function irParaMarcarConsulta(){
    localStorage.setItem("especialidade",document.getElementById("especialidadeSelect").value)
    localStorage.setItem("dataSelect",document.getElementById("dataSelect").value)
    window.location.href='../marcarConsulta/marcarConsulta.html'
}
function logout(){
    window.location.href = "/pages/login.html"
    localStorage.removeItem("token")
}