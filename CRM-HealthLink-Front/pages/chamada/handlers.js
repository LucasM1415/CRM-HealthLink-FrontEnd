let peerConnection;
let sendTo;
const remoteVideo = document.getElementById("remoteVideo")

let localStream;

async function getPermissions(){
    localStream = await navigator.mediaDevices.getUserMedia({audio: true})
    btnI.disabled = true;
    btnS.disabled = false;
    client.publish({destination: sendTo, body: JSON.stringify({type: 'ready'})})
}

function criarConnection(){
    peerConnection = new RTCPeerConnection()
    
    peerConnection.onicecandidate = e => {
        const message = {
          type: 'candidate',
          candidate: null,
        };
        if (e.candidate) {
          message.candidate = e.candidate.candidate;
          message.sdpMid = e.candidate.sdpMid;
          message.sdpMLineIndex = e.candidate.sdpMLineIndex;
        }
        client.publish({destination: sendTo,body: JSON.stringify(message)});
      };
    peerConnection.ontrack = e => remoteVideo.srcObject = e.streams[0];
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    
}
async function conectar(){
    criarConnection();

    const offer = await peerConnection.createOffer();
    client.publish({destination: sendTo,body: JSON.stringify(offer)})
    await peerConnection.setLocalDescription(offer)
    
}
function handleProntidao(msg){
  sendTo = "/app/sendTo/"+msg['sendTo']
  const prontidaoMsg = {
    type: "prontidaoResposta",
    sendTo: localStorage.getItem("email")
  }
  client.publish({destination: sendTo , body: JSON.stringify(prontidaoMsg)});
}

function handleProntidaoResposta(msg){
  sendTo = "/app/sendTo/"+msg['sendTo']
}
async function handleOffer(sdp){
  criarConnection();

  await peerConnection.setRemoteDescription(sdp)
  const answer = await peerConnection.createAnswer();
  client.publish({destination: sendTo, body: JSON.stringify(answer)})
  await peerConnection.setLocalDescription(answer)
}
async function handleCandidate(sdp){
  if (!sdp.candidate) {
    await peerConnection.addIceCandidate(null);
  } else {
    await peerConnection.addIceCandidate(sdp);
  }
}

async function handleAnswer(sdp){
  await peerConnection.setRemoteDescription(sdp)
}