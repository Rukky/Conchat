//Require the node cluster modules
//https://stackoverflow.com/questions/46122290/how-to-make-the-user-enter-a-specific-room-by-typing-its-name-int-the-url-sock //Room  Logic
//https://www.youtube.com/watch?v=k8o8-Q_-Qfk&list=PLw5h0DiJ-9PC7yXgSPse8NNROMKmjsxts //Whispers, MongoDB, username
//https://stackoverflow.com/questions/18310635/scaling-socket-io-to-multiple-node-js-processes-using-cluster //scaling with clusters
//	https://nodejs.org/api/cluster.html //Clusters
var cluster = require('cluster');
//Cluster workers based on the number of cores on the CPU
const numCPUs = require('os').cpus().length;

//If the cluster is the master worker, log it on the console and create a server
//that distributes incoming socket connections between the workers
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  var http = require('http');
  var server = http.createServer();
  var io = require('socket.io').listen(server);
  var Socketredis = require('socket.io-redis');
  io.adapter(Socketredis({ host: 'localhost', port: 6379 }));




// Fork workers.
for (let i = 0; i < numCPUs; i++) {
  cluster.fork();
 }
 //If a woker dies, log it to the console
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  //After forking workers in the master process create a server that listens on a port
  } else {
//Require our dependencies

    var express = require('express');
      var app = express();

       var http = require('http');
       var server = http.createServer(app);
       var io = require('socket.io').listen(server);
       var Socketredis = require('socket.io-redis');
       var SocketAntiSpam  = require('socket-anti-spam');
        mongoose = require('mongoose'),

           mongoose.connect('mongodb://localhost:27017/Conchat',{useNewUrlParser: true}, function(err){
             if (err){
               console.log(err);
             }else {
               console.log('connected to mongodb')
             }
           });

          var chatSchema = mongoose.Schema({
            Time : {type: Date, default: Date.now},
            username : String,
            message: String,
            Room: String,
          });
          var Chat = mongoose.model('Message', chatSchema);


       io.adapter(Socketredis({ host: 'localhost', port: 6379}));

//Settings for monitoring spam activity from the Socket Anti Spam module
       const socketAntiSpam = new SocketAntiSpam({
         banTime:            10,         // Ban time in minutes
         kickThreshold:      15,          // User gets kicked after this many spam score
         kickTimesBeforeBan: 3,          // User gets banned after this many kicks
         banning:            true,       // Uses temp IP banning after kickTimesBeforeBan
         io:                 io,  // Bind the socket.io variable
});

       // routing
       //User the public folder to serve static pages
       app.use(express.static('public'));

//Server the homepage when visiting localhost:8000
       app.get('/', function (req, res) {
         res.sendFile(__dirname + '/Public/Index.html');
       });

//When a string is entered after our homepage, server the chatroom page
       app.get(/(^\/[a-zA-Z0-9\-]+$)/, function (req, res){
         res.sendFile(__dirname + '/Public/Chat.html');
       });

       var users = {};


//This function runs when a socket connects
       io.on('connection', function(socket){
        io.set('transports', ['websocket']);

//The server receives an addUser event, checks if the data received is
//a unique username. If it is it adds it to out array of existing usernames and
// authenticates with the anti spam module and emits an event to the client
             socket.on('addUser', function (data, callback) {
               var room = socket.room
             if (data in users){
               callback(false);
             } else {
               callback(true);
              socket.username = data;
              users[socket.username] = socket;
                 socket.broadcast.to(room).emit('user joined', {
                   username: socket.username});
              socketAntiSpam.authenticate(socket);
            }
            var query = Chat.find({Room:room});
            query.sort({Time:-1}).limit(100).exec(function(err, docs){
             if(err) throw err;
             socket.emit('Load Stored Messages', docs);
           });
                });

                socket.on('returnUser', function (data, callback){
                  if(data in users){
                    callback(false);
                  }else{
                    callback(true);
                    socket.username = data;
                    users[socket.username] = socket;
                  }
                })

                //when the client emits the join even it tells them and other users
                //that a user joined
              socket.on('join', function(room){
                 socket.join(room);
                 socket.room = room;
                 socket.emit('you joined');
             });

             //This even checks if a message is private or not
              socket.on('Send Message', function (data, callback) {
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
                var newMessage = new Chat({
                  message:msg,
                  username: socket.username,
                  Room: socket.room,
                });
                newMessage.save(function(err){
                  if(err) throw err;
                io.sockets.in(socket.room).emit("chat message", {
                   username: socket.username,
                     message: msg});
                    })
                   }
             });

//when a socket disconnects, remove the username from our username array and tell
//users in the room that someone has disconnected.
              socket.on('disconnect', function () {
               socket.broadcast.to(socket.room).emit('user left', {
                 username:socket.username
               })
               delete users[socket.username];
               socket.leave(socket.room);
           });

//When a user sends too many messages and gets kicked inform them
           socketAntiSpam.event.on('kick', (socket, data) => {
           socket.emit('User Kicked');
         });
         //when a user gets banned inform them
           socketAntiSpam.event.on('ban', (socket, data) => {
           socket.emit('User Banned');
            });

       });

       //listen on this port
      server.listen(8000, '0.0.0.0');
      console.log("Listening")
      //log our workers and their IDs to check if they have started
      console.log(`Worker ${process.pid} started`);
    }
