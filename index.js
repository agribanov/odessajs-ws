const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let connectedUsersCount = 0;

app.use(express.static('public'));

io.on('connection', function (socket) {
    connectedUsers++;

    io.emit('usersCount', connectedUsersCount);

    socket.on('disconnect', function(){
        io.emit('usersCount', connectedUsersCount);
    });
    socket.on('feed', function (msg) {
        io.emit('feed');
    });
});

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});