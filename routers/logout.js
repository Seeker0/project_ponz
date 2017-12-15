'use strict';

const Express = require('express');
const router = Express.Router();
const mongoose = require('mongoose');
const { User } = require('./../models');
const passport = require('passport');

router.get('/', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
