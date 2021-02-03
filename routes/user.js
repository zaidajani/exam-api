const express = require('express');
const dotenv = require('dotenv').config();
const { Users, validateUser } = require('./../models/userdb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register/', async (req, res) => {
  const { error } = validateUser(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let usercheck = await Users.findOne({ email: req.body.email });
  if(usercheck) return res.status(400).send('User with this email allready exits.');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    isAdmin: false
  })
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['name', 'email', '_id']));
});

module.exports = router