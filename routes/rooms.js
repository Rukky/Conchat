var express = require('express');
var router = express.Router();
var path = require('path');



router.get('/chat/:room', function(req, res, next) {
  // res.sendFile here to send 'chat.html'
  res.sendFile(path.join(__dirname, '/public/Chatroom.html'));
});

var usernames ={};
io.on('connect', function(socket) {
  console.log('a user connected');
  // let the client join 'room' specified in the path
  socket.join(req.query.room);
  socket.on('sendchat', function (data) {
        io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    });

});
module.exports = router;
