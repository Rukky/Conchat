//Keep alive ping?
//display users in chat room

var cluster = require('cluster')
const numCPUs = require('os').cpus().length;



  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    var server = require('http').createServer();
   var io = require('socket.io').listen(server);
   var Socketredis = require('socket.io-redis');
    io.adapter(Socketredis({ host: 'localhost', port: 6379 }));




// Fork workers.
for (let i = 0; i < numCPUs; i++) {
  cluster.fork();

  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  } else {

    var express = require('express');
      var app = express();

        var http = require('http');
        var server = http.createServer(app);
       var io = require('socket.io').listen(server);
       var Socketredis = require('socket.io-redis');
       var SocketAntiSpam  = require('socket-anti-spam');
       io.adapter(Socketredis({ host: 'localhost', port: 6379}));

       const socketAntiSpam = new SocketAntiSpam({
  banTime:            30,         // Ban time in minutes
  kickThreshold:      15,          // User gets kicked after this many spam score
  kickTimesBeforeBan: 3,          // User gets banned after this many kicks
  banning:            true,       // Uses temp IP banning after kickTimesBeforeBan
  io:               io,  // Bind the socket.io variable
})


       var rooms = [];


       // routing
       app.use(express.static('public'));
       app.get('/', function (req, res) {
         res.sendFile(__dirname + '/Public/Index.html');
       });

       app.get(/(^\/[a-zA-Z0-9\-]+$)/, function (req, res){

           res.sendFile(__dirname + '/Public/Chat.html');

       })
       var users = {};


       io.on('connection', function(socket){
             socket.on('addUser', function (data, callback) {
             if (data in users){
               socket.emit('chat message', "username is taken")
             } else {
              socket.username = data;
              users[socket.username] = socket;
              socket.emit('addedUser');
              socketAntiSpam.authenticate(socket);
              updateUsers();
            }
});
function updateUsers(){
                io.sockets.in(socket.room).emit('usernames', Object.keys(users) );

}
               socket.on('join', function(room){
                 socket.join(room);
                 socket.room= room;
                 socket.emit('chat message', "connected", + process.pid)
                 socket.broadcast.to(room).emit("chat message", socket.username+' has connected to this room', cluster.worker.id);
                 io.in(socket.room).clients((err, clients) => {
                    users[clients] =socket;
                 // an array containing socket ids in 'room3'
               });
       })
       socketAntiSpam.event.on('authenticate', socket => {

})
socketAntiSpam.event.on('kick', (socket, data) => {
  socket.emit('chat message', "You have been kicked for spamming. You may reconnect and don't spam!")

  console.log(data)
})
socketAntiSpam.event.on('ban', (socket, data) => {
  socket.emit('chat message', "You have been Temporarily banned for spamming, You may reconnect shortly and don't spam!")

})



           socket.on('disconnect', function () {
               //May be do some authorization
               socket.broadcast.to(socket.room).emit("chat message", socket.username +' has disconnected', +process.pid);
               delete users[socket.username];
               socket.leave(socket.room);
               console.log(socket.id, "left", socket.room);
           });
           socket.on('chat message', function (msg) {
               //May be do some authorization
               io.sockets.in(socket.room).emit("chat message", msg, socket.username);

           });
           socket.on('reconnect', function(){
             console.log("reconnecting")
           })
       });
       server.listen(8000);
       console.log("Listening")
       console.log(`Worker ${process.pid} started`);

  }
