$(function () {
   var socket = io();
   socket.on('connect', function(){
        socket.emit("join", location.pathname, prompt("name?"));

   });
   $('form').submit(function(){
     socket.emit('chat message', $('#m').val());
     $('#m').val('');
     return false;
   });
   socket.on('chat message', function(msg, username){
          $('#messages').append('<b>'+username + ':</b> ' + msg + '<br>');
          window.scrollTo(0, document.body.scrollHeight);
        });
    socket.on('updateusers', function(users){
      $('#users').empty();
      $.each(users, function(key,value){
        $()
      })
    });

    var qrcode = new QRCode("qrcode");
document.getElementById('text').value = window.location;
function makeCode () {
    var elText = document.getElementById("text");

    if (!elText.value) {
        alert("Input a text");
        elText.focus();
        return;
    }

    qrcode.makeCode(elText.value);
}

makeCode();

$("#text").
    on("blur", function () {
        makeCode();
    }).
    on("keydown", function (e) {
        if (e.keyCode == 13) {
            makeCode();
        }
    });
 });
