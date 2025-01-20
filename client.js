const socket = io('https://citrine-obtainable-princess.glitch.me');

document.getElementById('join').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const room = document.getElementById('room').value;
    socket.emit('join', room);
    document.getElementById('chat').innerHTML += `<p>${name} joined the room</p>`;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = stream;

        const peer = new SimplePeer({ initiator: true, stream: stream });

        peer.on('signal', (data) => {
            socket.emit('signal', { to: room, signal: data });
        });

        socket.on('signal', (data) => {
            peer.signal(data.signal);
        });

        peer.on('stream', (stream) => {
            const remoteVideo = document.getElementById('remoteVideo');
            remoteVideo.srcObject = stream;
        });
    });
});

document.getElementById('send').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    const room = document.getElementById('room').value;
    socket.emit('message', { room, message });
    document.getElementById('chat').innerHTML += `<p>You: ${message}</p>`;
});

socket.on('message', (message) => {
    document.getElementById('chat').innerHTML += `<p>${message}</p>`;
});

socket
