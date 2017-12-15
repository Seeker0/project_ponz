const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema(
  {
    email: { type: String, required: false, unique: true },
    passwordHash: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'User' },
    children: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    points: { type: Number, default: 0 },
    depth: { type: Number, default: 0 }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual('password')
  .get(function() {
    return this._password;
  })
  .set(function(value) {
    this._password = value;
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

UserSchema.methods.setPoints = async function() {
  let countHash = {
    1: 40,
    2: 20,
    3: 10,
    4: 5,
    5: 2
  };

  let count = 0;
  let depthGetter = async function(user) {
    if (user.parent) {
      let parent = await User.findById(user.parent);
      count += 1;
      countHash[count]
        ? (parent.points += countHash[count])
        : (parent.points += 1);

      await parent.save();
      return depthGetter(parent);
    }
    return;
  };
  return depthGetter(this);
};

const autoPopulateChildren = function(next) {
  this.populate('children');
  next();
};

UserSchema.pre('findOne', autoPopulateChildren).pre(
  'find',
  autoPopulateChildren
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
