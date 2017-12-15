'use strict';

//==================
// home router
//==================

const Express = require('express');
const router = Express.Router();
const mongoose = require('mongoose');
const { User } = require('./../models');
const passport = require('passport');

// 1
router.get('/', async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      console.log(user);

      let pointsCalc = (children, divisor) => {
        if (children === undefined) {
          return 0;
        }
        let points = 40;
        if (!divisor) {
          var divisor = 1;
          points *= children.length;
        } else {
          points *= children.length / divisor;
        }
        children.forEach(child => {
          points += pointsCalc(child.children, divisor * 2);
        });
        return points;
      };

      let count = pointsCalc(user.children);

      res.render('home', {
        user: req.user,
        children: user.children, //needs to be a nested object
        link: `/ponvert/${req.user._id}`,
        points: count
      });
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
