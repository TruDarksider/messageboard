const dotenv = require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bcrypt = require('bcrypt');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messageboardRouter = require('./routes/messageboard')

var app = express();

//Set up mongoose connection
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;
const User = require('./models/User');


main().catch(err=>console.log(err));
async function main(){
  await mongoose.connect(mongoDB);
}

//Passport Setup
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
      .then(user => {
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (err) throw err
          if (res) {
            // passwords match! log user in
            return done(null, user)
          } else {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
          }
        })
      })
      .catch(err => {
        return done(err);
      }
    )
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(async function (req, res, next) {
  if (req.user!=undefined) {
    res.locals.currentUser = await User.findOne({username: req.user.username});
  } else {
    res.locals.currentUser = req.user;
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messageboard', messageboardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;