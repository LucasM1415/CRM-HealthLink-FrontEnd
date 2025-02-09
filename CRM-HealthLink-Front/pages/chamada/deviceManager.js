class DeviceManager {
    static localStream = '';
    static remoteVideoElement = document.getElementById("remoteVideo");
    static localVideoElement = document.getElementById("localVideo");

    static async getPermissions(){
        DeviceManager.localStream = await navigator.mediaDevices.getUserMedia({video: false,audio: true})
        DeviceManager.localVideoElement.srcObject =  new MediaStream(await DeviceManager.localStream.getVideoTracks())
    }

}