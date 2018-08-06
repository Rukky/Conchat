$(function () {
  var socket = io.connect('http://localhost:8000');
$('#redirect').click(function(data){
  socket.emit('createroom', data);
});
var destination = 'http://localhost:8000/Chatrooms/lala'
socket.on('redirect', function (destination) {
 window.location.href = destination;
});
});
