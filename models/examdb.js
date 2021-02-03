const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  grade: {
    type: Number,
    required: true
  },
  questions: {
    type: Array,
    required: true
  }
});

const Exam = mongoose.model('examPapers', schema);

exports.Exam = Exam;