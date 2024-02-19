const mongoose = require('mongoose');

const marks = mongoose.model('Mark', {
    subject: {
        type: String,
        requierd: true,
    },

        correctAnswersCount: {
        type: Number,
        requierd: true,
    },
      questions: {
       type: Number,
       requierd: true,
    },

      date: {
        type: Date,
        requierd: true
    },
      uid: {
        type: String,
        requierd: true
    }
});

 module.exports=marks
