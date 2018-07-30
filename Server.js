var express = require('express');
var createError = require('http-errors');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);
var path = require('path');
var Redis = require('ioredis');



var cluster = new Redis.Cluster([{
  port: 6379,
  host: 'localhost'
}]);
cluster.on('error',function (err) {
    console.log("REDIS CONNECT error "+ err);
    console.log('node error', err.lastNodeError);
});

cluster.connect();


var indexRouter = require('./routes/index');



http.listen('8000', function(){
  console.log("working");
});




app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use(function(req, res, next) {
  next(createError(404));
});

var numUsers = 0;
var usernames ={};

io.on('connection', function(socket){
  var addedUser = false;
  console.log('a user has connected');
  socket.on('disconnect', function(){
    if(addedUser){
      --numUsers;
    }
    io.emit('user left', {
      username: socket.username,
      numUsers:numUsers
    });
    console.log('a user has disconnected');
  });
  socket.on('adduser', function(username){
    if(addedUser) return;
    socket.username = username;
  usernames[username] = username;
  ++numUsers;
  addedUser = true
});
socket.on('new message', function(msg){
io.sockets.emit('new message', socket.username, msg);
});


});
module.exports = app;


// http://psitsmike.com/2011/09/node-js-and-socket-io-chat-tutorial/
