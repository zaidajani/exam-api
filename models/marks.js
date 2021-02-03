const { string } = require('@hapi/joi');
const mongoose = require('mongoose');

const schema = {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  marks: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  }
}