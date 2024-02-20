const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  correctAnswersCount: {
    type: Number,
    required: true,
  },
  questions: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
});

const Mark = mongoose.model('Mark', markSchema);

module.exports = Mark;
