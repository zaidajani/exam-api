const express = require('express');
const { networkInterfaces } = require('os');
const net = networkInterfaces();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;
const csvtojson = require('csvtojson');
const { Exam } = require('./../models/examdb');
const { Users } = require('./../models/userdb');
const auth = require('./../middlewares/auth');
const router = express.Router();

let jsonData;

router.get('/', auth, async (req, res) => {
  const user = await Users.findOne({ _id: { $eq: req.user._id } });
  if(user.isAdmin == false) {
    return res.status(403).send('Access forbidden. You dont have privilages to look at the test paper');
  }

  const data = await Exam.find();
  res.send(data);
});

router.get('/test/:id', auth, async (req, res) => {
  const user = await Users.findOne({ _id: { $eq: req.user._id } });
  if(user.isAdmin == false) {
    return res.status(403).send('Access forbidden. You dont have privilages to look at the test paper');
  }

  try {
    const data = await Exam.findOne({ _id: { $eq: req.params.id } });
    res.send(data);
  }
  catch (error) {
    return res.status(400).send('some error...');
  }
});

router.post('/', auth, async (req, res) => {
  const user = await Users.findOne({ _id: { $eq: req.user._id } });
  if(user.isAdmin == false) {
    return res.status(403).send('Access forbidden. You dont have privilages to look at the test paper');
  }

  if (req.files.testFile) {
    const file = req.files.testFile;
    file.mv('./static/test/' + file.name)
      .catch(err =>  { 
        console.log('err', err);
      });
    
    jsonData = await csvtojson()
    .fromFile(`./static/test/${file.name}`)
    .then((jsonObj) => {
      return jsonObj
    });

    const test = new Exam({
      grade: req.body.grade,
      questions: jsonData
    })
    await test.save();

    res.send(test);
  }
});


module.exports = router;