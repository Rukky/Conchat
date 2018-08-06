$(function () {
  var socket = io.connect('http://localhost:8000');
$('#redirect').click(function(data){
  socket.emit('createroom', data);
});
socket.on('redirect', function (destination) {
 window.location.href = destination;
});
});
