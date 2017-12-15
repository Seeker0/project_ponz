'use strict';

const Express = require('express');
const router = Express.Router();
const mongoose = require('mongoose');
const { User } = require('./../models');
const passport = require('passport');

router.get('/', (req, res) => {
  res.render('register');
});

router.post('/', (req, res, next) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  user.save((err, user) => {
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  });
});

module.exports = router;
