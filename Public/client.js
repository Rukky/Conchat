$(function () {
   var socket = io();
   socket.on('connect', function(){
     socket.emit('adduser', prompt("Enter a username"));
   });
   $('form').submit(function(){
     socket.emit('new message', $('#m').val());
     $('#m').val('');
     return false;
   });
   socket.on('new message', function(username, msg){
     $('#messages').append('<b>'+ username + ':</b> ' + msg + '<br>');
   });
 });
