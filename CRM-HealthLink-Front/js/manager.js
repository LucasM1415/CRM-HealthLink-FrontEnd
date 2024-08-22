const ip = 'localhost';

async function criarMedico(token, managerId) {
    if (!token) {
        alert('Usuário não autenticado.');
        return;
    }

    const url = `http://${ip}:8080/crmhealthlink/api/employee/doctor/${managerId}`;
     
}