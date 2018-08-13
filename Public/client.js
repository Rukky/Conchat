$(function () {
  var socket = io({
     'reconnection': true,
     'reconnectionDelay': 1000,
     'reconnectionDelayMax' : 5000,
     'reconnectionAttempts': 5
 });
   socket.on('connect', function(){
        socket.emit("addUser", prompt("name?"), function(data){
          if(data){
            alert('not taken');
          }else{
            alert('taken');
          }
        });
});
socket.on("addedUser", function(){
  socket.emit( "join", location.pathname);
});
socket.on('usernames', function(data){
    var html ='';
  for(i=0; i<data.length; i++){
    html += data[i] + '<br/>'
    $('#users').html(html);
  }
  console.log(data)

})
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
