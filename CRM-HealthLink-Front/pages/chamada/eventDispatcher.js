class EventDispatcher {
    static dispatcher = new EventTarget();

    static dispatch(eventName,SDP){
        EventDispatcher.dispatcher.dispatchEvent(new CustomEvent(eventName,{detail: {sdp: SDP}}))
    }
}