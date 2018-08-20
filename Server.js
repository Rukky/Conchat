
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
       var redis = require('redis');
       var redisClient = redis.createClient({ "host": "127.0.0.1", "port": 6379 });

       io.adapter(Socketredis({ host: 'localhost', port: 6379}));

       const socketAntiSpam = new SocketAntiSpam({
         banTime:            10,         // Ban time in minutes
         kickThreshold:      15,          // User gets kicked after this many spam score
         kickTimesBeforeBan: 3,          // User gets banned after this many kicks
         banning:            true,       // Uses temp IP banning after kickTimesBeforeBan
         io:                 io,  // Bind the socket.io variable
})


       var rooms = [];


       // routing
       app.use(express.static('public'));

       app.get('/', function (req, res) {
         res.sendFile(__dirname + '/Public/Index.html');
       });

       app.get(/(^\/[a-zA-Z0-9\-]+$)/, function (req, res){
         res.sendFile(__dirname + '/Public/Chat.html');
       });

       var users = {};

       io.on('connection', function(socket){

             socket.on('addUser', function (data, callback) {
             if (data in users){
               callback(false);
             } else {
               callback(true);
              socket.username = data;
              users[socket.username] = socket;
              socket.emit('addedUser');
              socketAntiSpam.authenticate(socket);
            }
                });
            
              socket.on('join', function(room){
                 socket.join(room);
                 socket.room= room;
                 socket.emit('you joined')
                 socket.broadcast.to(room).emit('user joined', {
                   username: socket.username});
                 io.in(socket.room).clients((err, clients) => {
                    users[clients] =socket;
               });
             });
              socket.on('Send Message', function (data, callback) {
               redisClient.lpush('messages', JSON.stringify(data)); // push into redis
               redisClient.lrange('messages', 0, 99, function(err, reply) {
               });
               console.log(data)
               var msg = data.trim();
               if(msg.substr(0,3) === '/w '){
                msg = msg.substr(3);
                var ind = msg.toString().indexOf(' ');
                 if(ind !== -1){
                   console.log('Whisper')
                   var name = msg.substring(0, ind);
                   var msg = msg.substring(ind + 1);
                   if(name in users){
                     users[name].emit("Private message", {
                       username:socket.username,
                       message:msg
                     });
                     socket.emit("Private message",{
                       username:socket.username,
                       message:msg
                     });

                   }
                   else{
                     callback('Please enter a valid user');
                   }
                }else{
                   callback('Please enter a message')
                 }
              }else {
                io.sockets.in(socket.room).emit("chat message", {
                   username: socket.username,
                     message: msg});
                   }
             });

              socket.on('disconnect', function () {
               //May be do some authorization
               socket.broadcast.to(socket.room).emit('user left', {
                 username:socket.username
               });
               delete users[socket.username];
               socket.leave(socket.room);
               console.log(socket.id, "left", socket.room);
           });

           socketAntiSpam.event.on('authenticate', socket => {
             })
           socketAntiSpam.event.on('kick', (socket, data) => {
           socket.emit('User Kicked');
           console.log(cluster.worker.id);
         });
           socketAntiSpam.event.on('ban', (socket, data) => {
           socket.emit('User Banned');
            })

       });
      server.listen(8000);
      console.log("Listening")
      console.log(`Worker ${process.pid} started`);
    }
