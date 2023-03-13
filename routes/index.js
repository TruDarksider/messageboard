const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require("passport");

/* GET home page. */
router.get('/', (req, res) => {
      res.render("index", {
        title: "Message Board Home",
        error: null,// err,
        data: null//results
      });
});
   
router.get('/signin', (req, res) => {
  res.render('signin', { title: 'Sign into Message Board'});
})

router.post("/signin",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
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