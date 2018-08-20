$(function () {
$('#change').click(function(){
  var id = Math.random().toString(36).substring(7);
  console.log(id);
  window.location="http://localhost:8000/" + id;
  return false;
});

});
