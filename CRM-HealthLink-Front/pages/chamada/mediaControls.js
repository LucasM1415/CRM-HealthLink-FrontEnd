// Função para alternar o microfone (mute/unmute)
function toggleMic() {
    if (!DeviceManager.localStream) {
        alert("Microfone não disponível. Certifique-se de que a mídia foi ativada primeiro.");
        return;
    }

    const audioTracks = DeviceManager.localStream.getAudioTracks();
    if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        document.getElementById("micButton").innerHTML = audioTracks[0].enabled
            ? '<i class="bi bi-mic-mute-fill"></i>'  // Ícone de microfone ligado
            : '<i class="bi bi-mic-fill"></i>';       // Ícone de microfone desligado

        console.log(audioTracks[0].enabled ? "Microfone ativado" : "Microfone silenciado");
    } else {
        alert("Nenhum microfone detectado.");
    }
}

// Função para alternar a câmera (ativa/desligada)
function toggleCam() {
    if (!DeviceManager.localStream) {
        alert("Câmera não disponível. Certifique-se de que a mídia foi ativada primeiro.");
        return;
    }

    const videoTracks = DeviceManager.localStream.getVideoTracks();
    if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        document.getElementById("camButton").innerHTML = videoTracks[0].enabled
            ? '<i class="bi bi-camera-video-off-fill"></i>' // Ícone de câmera ligada
            : '<i class="bi bi-camera-video-fill"></i>'; // Ícone de câmera desligada

        console.log(videoTracks[0].enabled ? "Câmera ativada" : "Câmera desligada");
    } else {
        alert("Nenhuma câmera detectada.");
    }
}

// Chama a função de captura de mídia da classe DeviceManager
DeviceManager.getPermissions();
