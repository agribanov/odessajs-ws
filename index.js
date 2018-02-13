const express = require('express');
const app = express();
const http = require('http').Server(app);
// const io = require('socket.io')(http);
var WebSocketServer = require('websocket').server;

let connectedUsersCount = 0;
var clients = [];

app.use(express.static('public'));

// io.on('connection', function (socket) {
//     connectedUsersCount++;

//     io.emit('usersCount', connectedUsersCount);
//     io.emit('message', {sender: 'System', body: 'User Connected'});

//     socket.on('disconnect', function () {
//         connectedUsersCount--;
//         io.emit('usersCount', connectedUsersCount);
//         io.emit('message', {sender: 'System', body: 'User Disconnected'});
//     });
//     socket.on('message', function (msg) {
//         io.emit('message', msg);
//     });
// });

http.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});

// create the server
wsServer = new WebSocketServer({
  httpServer: http
});

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  clients.push(connection)

  sendToAll({event: 'usersCount', data:clients.length})

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('message', message)
      sendToAll(JSON.parse(message.utf8Data))
    }
  });

  connection.on('close', function(con) {

    clients = clients.filter(function(client){ return client !== connection});

    console.log('connection closed', clients.length);
    sendToAll({event: 'usersCount', data: clients.length})
  });
});

function sendToAll(json){
    clients.forEach(function (client){client.sendUTF(JSON.stringify(json))});
}