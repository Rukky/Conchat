var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8000);

// routing
app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/Public/Index.html');
});

// usernames which are currently connected to the chat
var usernames = {};

var rooms = [];

io.sockets.on('connection', function(socket) {
    socket.on('adduser', function(data) {
      var username = data.username;
      var room = data.room;
        console.log(data);
if (rooms.indexOf(room) != -1) {
              socket.username = username;
              socket.room = room;
              usernames[username] = username;
              socket.join(room);

              socket.emit('updatechat', 'SERVER', 'You are connected. Start chatting');
              socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');

            } else {
        socket.emit('updatechat', 'SERVER', 'Please enter valid code.');
      }
      });


    socket.on('create', function(data) {
        var new_room = ("" + Math.random()).substring(2, 7);
        rooms.push(new_room);
        data.room = new_room;
        socket.emit('updatechat', 'SERVER', 'Your room is ready, invite someone using this ID:' + new_room);
        socket.emit('roomcreated', data);
        console.log('room created:'+ data)
    });

    socket.on('sendchat', function(data) {
        io.sockets["in"](socket.room).emit('updatechat', socket.username, data);
    });

    socket.on('switchRoom', function(newroom) {
        var oldroom;
        oldroom = socket.room;
        socket.leave(socket.room);
        socket.join(newroom);
        socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
        socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
        socket.emit('updaterooms', rooms, newroom);
    });

    socket.on('disconnect', function() {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        socket.leave(socket.room);
    });
 });
