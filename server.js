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

io.on('connection', socket => {
    console.log('a user connected', socket.id);

    socket.on('join', room => {
        socket.join(room);
        socket.to(room).emit('user-joined', socket.id);
    });

    socket.on('signal', ({ room, data }) => {
        socket.to(room).emit('signal', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
