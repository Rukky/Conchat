var socket = io.connect();
	// on connection to server, ask for user's name with an anonymous callback
  socket.on('connect', function(){
});

socket.on('updatechat', function (username, data) {
    $('#conversation').append('<b>'+ username + ':</b> ' + data + '<br>');
});

socket.on('roomcreated', function (data) {
    socket.emit('adduser', data);
  });;

function switchRoom(room){
    socket.emit('switchRoom', room);
}

$(function(){
    $('#datasend').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        socket.emit('sendchat', message);
    });

    $('#data').keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });

    $('#roombutton').click(function(){
         data.username = $('#roomname').val();
        $('#roomname').val('');
        socket.emit('create', data)
        console.log("client" + data)
    });
    $('#joinbutton').click(function(){
        var name = $('#username').val();
        $('#roomname').val('');
        var room = $('#').val();
        $('#Joinroom').val('');

        socket.emit('adduser', name, room)
    });
});
