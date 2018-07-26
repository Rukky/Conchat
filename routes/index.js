var express = require('express');
var router = express.Router();
var path = require('path');



router.get('/', function(req, res, next){
  res.render('index');
});
/* router.post('/', function(req, res, next){
  let jsonobj = req.body;
  jsonobj.id = Math.random().toString(36).substring(2, 15);
}) */

router.get('/:ID', function(req, res, next) {
  let ID = req.params
res.sendFile(path.join(__dirname, '../public', 'Chatroom.html'));
 console.log('room id is' + req.params);
});
/*http.on('request', (req, res) => {
  if (req.url === req.params) {
    res.sendFile(path.join(__dirname, '../public', 'Chatroom.html'));
  }
}); */



module.exports = router;
