const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

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
  res.redirect('/');
})

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