function renderInicialChamadaHome(){
    console.log("hello")
    const welcomeH1 = document.getElementById("welcome-message");
    welcomeH1.textContent = `Bem-vindo (a), ${localStorage.getItem("userName")}`;
}
renderInicialChamadaHome()
function voltar(caminhoPaginaVolta){
    window.location.href = caminhoPaginaVolta;
}