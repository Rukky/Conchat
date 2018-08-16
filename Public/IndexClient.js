$(function () {
$('#change').click(function(){
  var id = Math.random().toString(36).substring(7);
  console.log(id);
  window.location="http://127.0.0.1:8000/" + id;
  return false;
});

});
