  $(function(){
  var socket = io({
     'reconnection': true,
     'reconnectionDelay': 1000,
     'reconnectionDelayMax' : 5000,
     'reconnectionAttempts': 5
 });
 var $userError = $('#UserError');
 var $messages = $('.messages');
 var $m = $('#m').val(); // Messages area
 var id = Math.floor((Math.random() * 10000) + 1);

document.getElementById('Name').value = "Guest" +id ;

$('#Username').submit(function(e){
  e.preventDefault();
  socket.emit("addUser", $("#Name").val(),  function(data){
  if(data){
    $("#UserWrap").hide();
    $("#chatWrap").show();
}else{
    $userError.html("That username is taken please try again")
  }
});
return false;
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
 $("#MessageInput").submit(function(){
   socket.emit('Send Message', $('#m').val(), (data) =>{
    log(data)
     });
     $('#m').val('');
     return false;
   });

  socket.on('chat message', function(data){
          addChatMessage(data);
        });

  socket.on('updateusers', function(users){
      $('#users').empty();
      $.each(users, function(key,value){
        $()
      })
    });


socket.on('user joined', (data) => {
   log(data.username + ' joined!');
 });


 socket.on('you joined', ()=>{
   log("You have been connected, start chatting!");
   log("You can whisper another user using /w")
 });


 socket.on('Private message', (data) =>{
   addPrivateMessage(data);
 });


 socket.on('user left', (data) =>{
   log(data.username + 'left the room');
 });

 socket.on('User Kicked',(data)=>{
   log("You have been kicked for spamming! You may reconnect, but leave the spam behind!")
 });

 socket.on('User Banned', (data)=>{
   log("You have been temporarily banned for spamming, you may reconnect after 10 minutes")
 });

 const addChatMessage = (data) => {
       var $usernameDiv = $('<span class="username flow-text"/>')
         .text(data.username)
       var $messageBodyDiv = $('<span class="messageBody flow-text">')
         .text(data.message);
       var $messageDiv = $('<li class="message"/>')
         .data('username', data.username)
         .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv);
     };

  const addPrivateMessage = (data) => {
         var $usernameDiv = $('<span class="username flow-text"/>')
           .text(data.username)
         var $messageBodyDiv = $('<span class="messageBody flow-text">')
           .text(data.message);
          var $messageDiv = $('<li class="pm center-align"/>')
           .data('username', data.username)
           .append($usernameDiv, $messageBodyDiv);

         addMessageElement($messageDiv);
       }
   const addMessageElement = (el) => {
       var $el = $(el);
         $messages.append($el);
       $messages[0].scrollTop = $messages[0].scrollHeight;
     }
   const log = (message) => {
    var $el = $('<li>').addClass('log center-align flow-text').text(message);

    addMessageElement($el);
}

  var qrcode = new QRCode("qrcode");
  document.getElementById('QRtext').value = window.location;
  function makeCode () {
    var elText = document.getElementById("QRtext");

    if (!elText.value) {
        alert("Input a text");
        elText.focus();
        return;
    }

    qrcode.makeCode(elText.value);
  }

  makeCode();

$("#QRtext").
    on("blur", function () {
        makeCode();
    }).
    on("keydown", function (e) {
        if (e.keyCode == 13) {
            makeCode();
        }
    });


      $('.modal').modal();
      $('.sidenav').sidenav();
      $('.tooltipped').tooltip();
});
