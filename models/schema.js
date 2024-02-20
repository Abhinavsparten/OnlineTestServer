const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  uname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: value => {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid Email');
        }
      }
    }
  },
  psw: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
