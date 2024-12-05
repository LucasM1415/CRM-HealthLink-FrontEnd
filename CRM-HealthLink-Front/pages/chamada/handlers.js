let peerConnection;

function criarConnection(){
    peerConnection = new RTCPeerConnection(
        {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' }
            ]
          }
    );
    
    peerConnection.onicecandidate = e => {
        MessageManager.candidate(e)
    };
    peerConnection.ontrack = e => DeviceManager.remoteVideoElement.srcObject = e.streams[0];
    DeviceManager.localStream.getTracks()
    .forEach(track => peerConnection.addTrack(track, DeviceManager.localStream));
    
}

async function handleOffer(e){
    const sdp = e.detail.sdp
    criarConnection();
    MessageManager.sendToUser = sdp["sendTo"];
    
    delete sdp.sendTo;

    await peerConnection.setRemoteDescription(sdp)
    const answer = await peerConnection.createAnswer();
    MessageManager.send(answer)
    await peerConnection.setLocalDescription(answer)
}
async function handleAnswer(e){
    await peerConnection.setRemoteDescription(e.detail.sdp)
}

async function handleDoOffer(e){
    const sdp =e.detail.sdp

    MessageManager.sendToUser = sdp["sendTo"];
    criarConnection()

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer)
    offer.sendTo = localStorage.getItem("email");
    MessageManager.send(offer)
}

async function handleCandidate(e){
    const sdp = e.detail.sdp
    if (!sdp.candidate) {
        await peerConnection.addIceCandidate(null);
      } else {
        await peerConnection.addIceCandidate(sdp);
      }
}
//function handleHangout(sdp){}


EventDispatcher.dispatcher.addEventListener("offer",(e)=>{
    handleOffer(e);
    document.getElementsByClassName("loader-container")[0].style.display = "none"
    DeviceManager.remoteVideoElement.style.display = "block"
})

EventDispatcher.dispatcher.addEventListener("doOffer",(e)=>{
    handleDoOffer(e);
    document.getElementsByClassName("loader-container")[0].style.display = "none"
    DeviceManager.remoteVideoElement.style.display = "block"
})

EventDispatcher.dispatcher.addEventListener("answer",handleAnswer)
EventDispatcher.dispatcher.addEventListener("candidate",handleCandidate)
//EventDispatcher.dispatcher.addEventListener("doOffer",handleDoOffer)
//EventDispatcher.dispatcher.addEventListener("hangout",handleOffer)