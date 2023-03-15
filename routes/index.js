const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');
const bcrypt = require('bcrypt');
const passport = require("passport");
const async = require('async');

/* GET home page. */
router.get('/', async (req, res) => {
  let results = {
    userCount: await User.countDocuments({}),
    memberCount: await User.countDocuments({ isMember: true }),
    adminCount: await User.countDocuments({ isAdmin: true }),
    messageCount: await Message.countDocuments({}),
  }
  res.render("index", {
    title: "Message Board Home",
    error: null,//err,
    data: results,
  });
});
   
router.get('/signin', (req, res) => {
  res.render('signin', {
    title: 'Sign into Message Board',
    message: {}
  });
})

router.post("/signin",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signin"
  })
);

router.get('/signup', (req, res) => {
  res.render('signup', {title: 'Sign up for Message Board'});
})

router.post('/signup', async (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10)
  }).save().then(res.redirect('/')).catch(err => next(err));
})

router.get('/signout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;