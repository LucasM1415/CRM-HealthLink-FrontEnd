class DeviceManager {
    static localStream = '';
    static remoteVideoElement = document.getElementById("remoteVideo");

    static async getPermissions(){
        DeviceManager.localStream = await navigator.mediaDevices.getUserMedia({audio: true})
    }

}