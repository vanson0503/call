const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

let livestreamAvailable = false;
let streamUrl;

io.on('connection', socket => {
    console.log('a user connected', socket.id);

    socket.on('join', room => {
        socket.join(room);
        socket.to(room).emit('user-joined');
    });

    socket.on('signal', ({ room, data }) => {
        socket.to(room).emit('signal', data);
    });

    socket.on('request-stream', room => {
        if (livestreamAvailable) {
            socket.emit('stream-available', streamUrl);
        } else {
            socket.emit('no-stream-available');
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Mock livestream availability
setTimeout(() => {
    livestreamAvailable = true;
    streamUrl = 'http://example.com/livestream';
}, 5000);
