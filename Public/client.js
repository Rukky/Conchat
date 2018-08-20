//Wrap in a function that runs when our HTML has loaded
  $(function(){
    //connect to our socket, this seems to not be needed on windows
  var socket = io(
     'ws://localhost:8000', {transports: ['websocket']}
 );

 //Our variable declarations for HTML elements
 var $userError = $('#UserError');
 var $messages = $('.messages');
 var $m = $('#m').val(); // Messages area
 //A random number between 1 and 10000 to add to our default username
 var id = Math.floor((Math.random() * 10000) + 1);

//Users can log in using a Guest default name, followed by random number to make
//it unique
document.getElementById('Name').value = "Guest" +id ;

//When the user submits their username check with the server if it is valid
//if it is valid, show the chatroom
$('#Username').submit(function(e){
  e.preventDefault();
  socket.emit("addUser", $("#Name").val(), function(data){
  if(data){
    $("#UserWrap").hide();
    $("#chatWrap").show();
    $("footer").hide();
}else{
    $userError.html("That username is taken please try again")
  }
});
return false;
});

//When the server emits this event, send back the join event and the pathname of
//our url as a room
socket.on("addedUser", function(){
  socket.emit( "join", location.pathname);
});

//When the user send a message, emit the send message event to the server
 $("#MessageInput").submit(function(){
   socket.emit('Send Message', $('#m').val(), function(data){
    log(data)
     });
     $('#m').val('');
     return false;
   });

//The server emit this event if it is a general message, add the data to the chatroom
  socket.on('chat message', function(data){
          addChatMessage(data);
        });

//When the server emits a user has joined, tell the other users
socket.on('user joined', (data) => {
   log(data.username + ' joined!');
 });

//when the server emits that you have joined tell the user
 socket.on('you joined', ()=>{
   log("You have been connected, start chatting!");
   log("You can whisper another user using /w")
 });

//The server determined that this is a private message so send it to the
//appropriate user
 socket.on('Private message', (data) =>{
   addPrivateMessage(data);
 });

//Tells users that a user has left
 socket.on('user left', (data) =>{
   log(data.username + ' left the room');
 });

//Show this message when a user is kicked
 socket.on('User Kicked',(data)=>{
   log("You have been kicked for spamming! You may reconnect, but leave the spam behind!")
 });

//Show this message when a user is banned
 socket.on('User Banned', (data)=>{
   log("You have been temporarily banned for spamming, you may reconnect after 10 minutes")
 });

//This function appends the username and message to the message div in the chat room
 const addChatMessage = (data) => {
       var $usernameDiv = $('<span class="username flow-text"/>')
         .text(data.username)
       var $messageBodyDiv = $('<span class="messageBody flow-text">')
         .text(data.message);
       var $messageDiv = $('<li class="message"/>')
         .data('username', data.username)
         .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv);
     });

//This function appends a private message to the message div in the chat rooms
//It is stylised and can only be seen by the intended user
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

       //This appends messages to the the message div  in the chatroom and scrolls
       //when a new message is received
   const addMessageElement = (el) => {
       var $el = $(el);
         $messages.append($el);
       $messages[0].scrollTop = $messages[0].scrollHeight;
     }

     //This appends messages from the server to the chatroom
   const log = (message) => {
    var $el = $('<li>').addClass('log center-align flow-text').text(message);

    addMessageElement($el);
});

//This creates our QR code using the value of the URL
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

//This handles the functionality of our CSS
      $('.modal').modal();
      $('.sidenav').sidenav();
      $('.tooltipped').tooltip();
});
