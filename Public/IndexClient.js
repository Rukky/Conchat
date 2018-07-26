  //let ID = Math.random().toString(36).substring(2, 15);
$(function(){
  $('input').click(function()
    {
  fetch('/', {
    method:'POST',
    headers: new Headers ({'Content-Type': 'application/json'}),
     body: JSON.stringify(json) })
    .then(res => res.json())
    .then(data => ChatRoomID(data))
    .catch(err => console.log(err));
  });
  function ChatRoomID(id){
    let  ID = id;
    location.href ='localhost:8000/'+ ID;
  }



  console.log(ID);
  })
});
