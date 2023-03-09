var express = require('express');
var router = express.Router();

/* GET message board messages. */
router.get('/', function(req, res, next) {
    res.render('messageboard', {
      title: 'The Message Board'
  })
});

router.get('/members', function(req, res, next) {
    res.render('messageboard', {
      title: 'The Message Board: Member View'
  })
});

router.get('/admins', function(req, res, next) {
    res.render('messageboard', {
      title: 'The Message Board: Admin View'
  })
});

module.exports = router;