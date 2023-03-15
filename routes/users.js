var express = require('express');
var router = express.Router();
const User = require('../models/User')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  res.render('users', {
    title: "List of Contributors",
    user_list: await User.find({}).sort({username: 1})
  })
});

module.exports = router;
