async function doSubscribeAndGetPermissions(){
    await DeviceManager.getPermissions();
    WsConnFac.get().subscribe(MessageManager.hearingAt, async (msg) =>{
        const sdp = JSON.parse(msg.body)

        EventDispatcher.dispatch(sdp.type,sdp);
    })
}

async function onConnectPatientProntidao(){
    await doSubscribeAndGetPermissions()
    MessageManager.prontidao();   
}

async function onConnectDoctor(){
    await doSubscribeAndGetPermissions()
    
}
