const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
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
    username: {
    type: String,
    required: true,
  },
  timeTaken: {
    type: Number,
    required: true,
  }
  
});
const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;
