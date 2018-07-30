var express = require('express');
var router = express.Router();
var path = require('path');



router.get('/', function(req, res, next){
  res.render('index');
});

router.get('/:ID', function(req, res, next) {
  let id= req.params.ID;
res.sendFile(path.join(__dirname, '../public', 'Chatroom.html'));
console.log(id);
});


module.exports = router;
