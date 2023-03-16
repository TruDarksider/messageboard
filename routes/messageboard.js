const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator')
const Message = require('../models/Message');
const User = require('../models/User');

//Display messages
const messages = async (req, res, next) => {
  try {
    const list_messages = await Message.find()
      .sort({ posted: 1 })
      .populate('author');
    res.render('messageboard', { title: 'The Message Board', messages: list_messages })
  } catch (err) {
    return next(err);
  }
};

/* GET message board routes. */
router.get('/', messages);

router.post('/', (req, res) => {
  Message.findByIdAndRemove(req.body.messageid).catch(err => next(err))
  res.redirect('/messageboard');
})

router.get('/becomeMember', function(req, res, next) {
    res.render('becomeMember', {
      title: 'Become a Member',
      incorrect: false
  })
});

router.post('/becomeMember', async (req, res, next) => {
  body('memberSecret', 'There is a password')
    .trim()
    .isLength({ min: 1 })
    .escape()
  if (req.body.memberSecret === process.env.MEMBER_SECRET) {
    await User.updateOne({ _id: req.user.id }, {$set: { isMember: true }})
      .catch(err => next(err))
    res.redirect('/messageboard')
  } else {
    res.render('becomeMember', {
      title: "Become a Member",
      incorrect: true
    })
  }
})

router.get('/becomeAdmin', function(req, res, next) {
  res.render('becomeAdmin', {
    title: 'Become an Admin',
    incorrect: false
  })
});

router.post('/becomeAdmin', async (req, res, next) => {
  body('adminSecret', 'There is a password')
    .trim()
    .isLength({ min: 1 })
    .escape()
  if (req.body.adminSecret === process.env.ADMIN_SECRET) {
    await User.updateOne({ _id: req.user.id }, { $set: { isAdmin: true } })
      .catch(err=>next(err))
    res.redirect('/messageboard');
  } else {
    res.render('becomeAdmin', {
    title: 'Become an Admin',
    incorrect: true
  })
  }
})

module.exports = router;