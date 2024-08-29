const socket = io();

let local;
let remote;
let peerConnection;

const rtcSettings = {
    iceServers : [{urls : process.env.stun_server}]
}

const initialize = async() => {
    local = await navigator.mediaDevices.getUserMedia({
        audio:true,
        video:true
    })

    initiateOffer()
}

const initiateOffer = async() =>{
    await createPeerConnection();
    
    const offer  = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("singnalingMessage", JSON.stringify({type: "offer", offer}))
};

const createPeerConnection = async() =>{
    peerConnection = new RTCPeerConnection(rtcSettings);

    remote = new MediaStream();
    document.querySelector("#remoteVideo").srcObject = remote;
    document.querySelector("#remoteVideo").style.display = "block";
    document.querySelector("#localVideo").classList.add("smallFrame")


    local.getTracks().forEach() ((track) => {
        peerConnection.addTrack(track, local);
    })

    peerConnection.ontrack = (event) =>
        event.streams[0].getTracks().forEach((track) => 
            remote.addTrack(track));

    peerConnection.onicecandidate = (event) =>
        event.candidate &&
            socket.emit(
                "singnalingMessage",
                JSON.stringify({type: "candidate" , candidate: event.candidate})
            );
};

initialize();

