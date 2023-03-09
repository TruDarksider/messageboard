var express = require('express');
var router = express.Router();

/* GET message board messages. */
router.get('/', function(req, res, next) {
  res.send('These will be messages someday');
});

router.get('/members', (req,res,next)=>{
  res.send('eyyyyy member 420 420 420 420 heh heh heh')
});

module.exports = router;