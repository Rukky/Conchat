var cluster = require('cluster')
const numCPUs = require('os').cpus().length;



  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    var server = require('http').createServer();
   var io = require('socket.io').listen(server);
   var redis = require('socket.io-redis');
    io.adapter(redis({ host: 'localhost', port: 6379 }));




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
       var redis = require('socket.io-redis');
       io.adapter(redis({ host: 'localhost', port: 6379}));



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
       // usernames which are currently connected to the chat

       io.on('connection', function(socket){

           socket.on('join', function (room, username) {
               socket.username = username;
               //May be do some authorization
               socket.join(room);
               socket.room= room;
               usernames[username] = username;
               console.log(usernames)
               socket.emit('chat message', "connected to" + room, cluster.worker.id)
               socket.broadcast.to(room).emit("chat message", username +' has connected to this room', cluster.worker.id);
               console.log(socket.id, "joined", room);





           });


           socket.on('disconnect', function () {
               //May be do some authorization
               socket.broadcast.to(socket.room).emit("chat message", socket.username +' has disconnected', cluster.worker.id);
               delete usernames[socket.username];
               socket.leave(socket.room);
               console.log(socket.id, "left", socket.room);
           });
           socket.on('chat message', function (msg) {
               //May be do some authorization
               io.sockets.in(socket.room).emit("chat message", msg, socket.username);

           });
       });
       server.listen(8000);
       console.log("Listening")
       console.log(`Worker ${process.pid} started`);

  }
