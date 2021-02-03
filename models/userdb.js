const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  }
});


schema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.jwtPrivateKey);
  return token;
};

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).max(15).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(3).max(100).required(),
  }

  return Joi.validate(user, schema);
}

const Users = mongoose.model('users', schema);

exports.Users = Users;
exports.validateUser = validateUser;