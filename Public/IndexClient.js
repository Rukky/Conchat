
window.onload = function () {
    var ID = Math.random().toString(36).substring(2, 15);
    document.getElementById("redirect").onclick = function () {
       window.location= 'http://localhost:8000/'+ ID;
   }
   console.log(ID);
};
