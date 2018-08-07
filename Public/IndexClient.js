$(function () {
$('#change').click(function(){
  var room = $("#vary").val();
  console.log(room);
  window.location="http://localhost:8000/" + room;
  return false;
});

});
