const ip = 'localhost';

async function listar_consultas(token) {
    
    alert(token)
    if (!token) {
        alert('Usuário não autenticado.');
        return;
    }

    try {
        const response = await fetch(`http://${ip}:8080/crmhealthlink/api/patient/appointments/${paciente.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data); // Processa e exibe os dados conforme necessário
            alert("Exames listados com sucesso.");
        } else {
            throw new Error('Erro ao listar exames');
        }
    } catch (error) {
        console.error('Erro ao listar exames:', error);
        alert('Erro ao listar exames. Por favor, tente novamente.');
    }
}


function getToken() {
    var token = localStorage.getItem('token');
    if (token == null) {
      window.location.href = '../index.html';
    } else {
      listar_consultas(token);
  
  
    }
  }
  getToken();
  
  function singOut() {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
      alert("Você foi desconectado com sucesso.");
      window.location.href = "../index.html";
    } else {
      console.error("Local storage não está disponível.");
    }
  }