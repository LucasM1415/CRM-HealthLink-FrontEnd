async function marcarConsulta(disponibilidade){
    let body = {
        date: disponibilidade.data,
        inicio: disponibilidade.inicio,
        fim: disponibilidade.fim,
        speciality: disponibilidade.especialidade,
        email_doctor: disponibilidade.emailMedico,
        email_patient: localStorage.getItem("email")
    }
    const response = await fetch("http://localhost:8080/api/appointment", {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Accept': 'application/json',
            "Content-Type": "application/json"
          },
        body: JSON.stringify(body)
    })
    
    if(response.ok){
        alert("Consulta marcada com sucesso!")
        voltarPacienteHome()
    }
}