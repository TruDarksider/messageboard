const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Message = require('../models/Message');
const bcrypt = require('bcrypt');
const passport = require("passport");
const { DateTime } = require('luxon')
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

router.get('/newMessage', function(req, res, next){
  if(req.user != undefined){
    if (req.user.isMember || req.user.isAdmin) {
      res.render('newMessage', {
        title: "Post a new message",
        errors: null
      })
    }} else {
    res.redirect('/messageboard/members')
  }
})

router.post('/newMessage', (req, res, next) => {
  //Validate and Sanitize
  body('message', 'Cannot post an empty message')
    .trim()
    .isLength({ min: 1 })
    .escape()
  //Extract errors
  const errors = validationResult(req);
  //Message created with escaped and trimmed data
  const message = new Message({
    text: req.body.message,
    author: req.user.username,
    posted: DateTime.now()
  })

  if (!errors.isEmpty()) {
    res.render('/newMessage', {
      title: "Post a new message",
      errors: errors.array()
    })
    return;
  }
  //No errors so save message
  message.save().then(res.redirect('/messageboard'))
})

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
  res.render('signup', {
    title: 'Sign up for Message Board',
    errors: null
  });
})

router.post('/signup', async (req, res, next) => {
  body('username', "Cannot have an empty username")
    .trim()
    .isLength({ min: 1 })
    .escape();
  body('password', "Password cannot be empty, no other restrictions")
    .trim()
    .isLength({ min: 1 })
    .escape();
  const errors = validationResult(req);
  const user = new User({
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10)
  });
  if (!errors.isEmpty()) {
    res.render('/signup', {
      title: "Sign up for Message Board",
      errors: errors.array()
    })
    return;
  }
    message.save().then(res.redirect('/signin')).catch(err => next(err));
})

router.get('/signout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;