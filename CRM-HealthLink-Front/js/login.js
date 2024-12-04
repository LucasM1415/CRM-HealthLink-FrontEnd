const ip = 'localhost';

function handleLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const email = emailInput.value;
  const password = passwordInput.value;

  if (email.trim() === '' || password.trim() === '') {
    alert('Please enter your email and password.');
    return;
  }

  const url = `http://${ip}:8080/auth/login`;

  const body = {
    email,
    password,
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      switch (data.acessLevel) {
        case 'PATIENT':
          localStorage.setItem('token', data.token)
          localStorage.setItem('userName', data.name)
          localStorage.setItem('email', data.email)
          localStorage.setItem('acessLeval', data.acessLevel)
          console.log('Login successful:', data);
          window.location.href = '/pages/paciente/home/patientPage.html';
          break;
        case 'DOCTOR':
          localStorage.setItem('token', data.token)
          localStorage.setItem('userName', data.name)
          localStorage.setItem('email', data.email)
          localStorage.setItem('acessLeval', data.acessLevel)
          localStorage.setItem('crm',data.crm)
          localStorage.setItem('speciality',data.speciality)
          console.log('Login successful:', data);
          window.location.href = '../pages/doctorPage.html';
          break;
        case 'ATTENDANT':
          localStorage.setItem('token', data.token)
          localStorage.setItem('userName', data.name)
          localStorage.setItem('email', data.email)
          localStorage.setItem('acessLeval', data.acessLevel)
          console.log('Login successful:', data);
          window.location.href = '/pages/atendente/home/attendantPage.html'; // Tela Primeira Versão'/pages/atendente/home/employeePage.html'
          break;
        case 'MANAGER':
          localStorage.setItem('token', data.token)
          localStorage.setItem('userName', data.name)
          localStorage.setItem('email', data.email)
          localStorage.setItem('acessLeval', data.acessLevel)
          console.log('Login successful:', data);
          window.location.href = '../pages/managerPage.html';
          break;
      }

    })
    .catch(error => {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials and try again.');
    });
}

const loginForm = document.querySelector('form');
loginForm.addEventListener('submit', handleLogin);
