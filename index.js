const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const upload = require('express-fileupload');
const cors = require('cors');
const port = process.env.PORT || 3000;
const path = require('path');
const csv = require('csvtojson');
const admin = require('./routes/admin');
const user = require('./routes/user');
const app = express();

if(!process.env.jwtPrivateKey) {
  console.error('Fatal error: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose
  .connect('mongodb://localhost/exam-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('connected to mongoDb');
  })
  .catch((err) => {
    console.log('error connecting to MongoDb');
  });

app.use(cors());
app.use(express.json());
app.use(upload());
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/', admin);
app.use('/user/', user);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});