var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8000);
console.log("Listening")

var rooms = [];


// routing
app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/Public/Index.html');
});

app.get(/(^\/[a-zA-Z0-9\-]+$)/, function (req, res){

    res.sendFile(__dirname + '/Public/Chat.html');

})
var usernames = {};
console.log(usernames);
// usernames which are currently connected to the chat
io.on('connection', function(socket){

    socket.on('join', function (room, username) {
      socket.username= username;

        //May be do some authorization
        socket.join(room);
        socket.room= room;
        usernames[username] = username;
        socket.emit('chat message', "connected to" + room)
        socket.broadcast.to(room).emit("chat message", username +' has connected to this room');
        console.log(socket.id, "joined", room);
    });

    socket.on('leave', function (room) {
        //May be do some authorization
        socket.leave(room);
        console.log(socket.id, "left", room);
    });
    socket.on('chat message', function (msg) {
        //May be do some authorization
        io.sockets.in(socket.room).emit("chat message", msg, socket.username);

    });
});
