const hearingAt = `/user/queue`;
let subs;

const client = new StompJs.Client({
    brokerURL: `ws://localhost:8080/ws?token=${localStorage.getItem("token")}`,
  connectHeaders: {
    login: 'user',
    passcode: 'password'
  },
  debug: function (str) {
    //console.log(str);
  },
  //reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

client.onConnect = function (frame) {
  subs = client.subscribe(hearingAt,(message)=>{
    
    const sdp = JSON.parse(message.body)
    switch(sdp.type){
      case 'offer':
        handleOffer(sdp);
        break;
      case 'answer':
        handleAnswer(sdp);
        break;
      case 'candidate':
        handleCandidate(sdp);
        break;
      case 'ready':
        conectar();
        break;
      case 'prontidao':
        handleProntidao(sdp)
        break;
      case 'prontidaoResposta':
        handleProntidaoResposta(sdp)
        break;
      case 'sair':
        sairChamada();
        break;
      default:
        console.log('nada', e);
        break;

    }
  })
  getPermissions();
  if(localStorage.getItem("acessLeval")=="PATIENT"){
      client.publish({destination: "/app/prontidao"})
  }
};

function start(){
  client.activate()
  const remoteVideo = document.getElementById("remoteVideo")
  remoteVideo.style.display = "block";
}

function sairChamada(){
  subs.unsubscribe()
  client.deactivate();

  peerConnection.close();
  localStream.getTracks().forEach(track => track.stop());
  btnI.disabled = false;
  btnS.disabled = true;
}

const btnI = document.getElementById("iniciar-chamada");
const btnS = document.getElementById("sair-chamada");

btnI.addEventListener("click",start)
btnS.addEventListener("click", sairChamada)


