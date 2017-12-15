'use strict';

//==================
// home router
//==================

const Express = require('express');
const router = Express.Router();
const mongoose = require('mongoose');
const { User } = require('./../models');
const passport = require('passport');

// 2
router.get('/register', async (req, res) => {
  let parent = await User.findById(req.session.parentId);
  res.render('ponvert-register', { parent });
});

// 3

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, parentId, parentDepth } = req.body;

    //create a new user from referral link
    let user = new User({
      email: email,
      password: password,
      parent: parentId,
      depth: Number(parentDepth) + 1
    });
    user = await user.save();

    //find the referree aka parent
    const parent = await User.findById(parentId);

    //add the new user as the parent's child
    parent.children.push(user._id);
    await parent.save();

    await user.setPoints();

    //login the new user
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  } catch (err) {
    console.log(err);
  }
});

// 1
router.get('/:id', (req, res) => {
  req.session.parentId = req.params.id;
  res.redirect('/ponvert/register');
  // }
});

module.exports = router;
