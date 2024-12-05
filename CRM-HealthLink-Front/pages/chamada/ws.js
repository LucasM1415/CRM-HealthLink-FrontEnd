class WsConnFac {
    static client = '';

    static createClient(){
        WsConnFac.client = new StompJs.Client({
            brokerURL: `https://crm-healthlink.onrender.com/ws?token=${localStorage.getItem("token")}`,
          connectHeaders: {
            login: 'user',
            passcode: 'password'
          },
          debug: function (str) {
            console.log(str);
          },
          //reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

    }
    static get(onConnectFunc){
        if(onConnectFunc == undefined && !WsConnFac.client)
            throw "Você deve passar uma função para usar em onConnect"
        if(!WsConnFac.client || !WsConnFac.client.connected){
            WsConnFac.createClient();
            WsConnFac.client.onConnect = onConnectFunc;
            WsConnFac.client.activate();
        }
        return WsConnFac.client;
    }
}

class MessageManager {
    static prontidaoRota = "/app/prontidao"
    static sendToRoute = '/app/sendTo/'
    static hearingAt = "/user/queue";
    static sendToUser = '';

    static prontidao(){    
        const client = WsConnFac.get();
        client.publish({destination: MessageManager.prontidaoRota})
    }
    
    /* static consulta(){
        client.publish({destination: MessageManager.sendToUser, body: sdp})
    } */

    static candidate(candidateEvent){
        const client = WsConnFac.get();
        const message = {
            type: 'candidate',
            candidate: null,
        };
        if (candidateEvent.candidate) {
            message.candidate = candidateEvent.candidate.candidate;
            message.sdpMid = candidateEvent.candidate.sdpMid;
            message.sdpMLineIndex = candidateEvent.candidate.sdpMLineIndex;
        }
        client.publish({destination: MessageManager.sendToRoute + MessageManager.sendToUser,
            body: JSON.stringify(message)});
    };
          
    static send(sdp){
        const client = WsConnFac.get();
        client.publish({destination: MessageManager.sendToRoute + MessageManager.sendToUser, 
            body: JSON.stringify(sdp)})
    }
}




//console.log(WsConnFac.get(onConnectDoctor).connected)

