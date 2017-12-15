'use strict';
const mongoose = require('mongoose');
const mongooseeder = require('mongooseeder');
const models = require('../models');
const { User, Secret } = require('../models');
const faker = require('faker');

const mongodbUrl = 'mongodb://localhost/ponzie_development';

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  models: models,
  clean: true,
  mongoose: mongoose,
  seeds: () => {
    let users = [];

    let user;

    for (let i = 0; i < 50; i++) {
      if (i === 0) {
        user = new User({
          email: `${i}@user${i}.com`,
          passwordHash: ''
        });
        user.set('password', `password${i}`);
        users.push(user);
      } else if (i > 0 && i < 10) {
        user = new User({
          email: `${i}@user${i}.com`,
          passwordHash: '',
          parent: users[0]._id,
          depth: users[0].depth + 1
        });
        users[0].children.push(user._id);
        user.set('password', `password${i}`);
        users.push(user);
      } else {
        user = new User({
          email: `${i}@user${i}.com`,
          passwordHash: '',
          parent: users[i - 10]._id,
          depth: users[i - 10].depth + 1
        });
        user.set('password', `password${i}`);
        users[i - 10].children.push(user._id);
        users.push(user);
      }
    }

    const promises = [];
    const collections = [users];

    collections.forEach(collection => {
      collection.forEach(model => {
        const promise = model.save();
        promises.push(promise);
      });
    });

    return Promise.all(promises);
  }
});
