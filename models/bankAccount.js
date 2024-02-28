const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
    accno: {
    type: Number,
    required: true,
  },
    bankName: {
    type: String,
    required: true,
  },
    psw: {
    type: String,
    required: true
  },
    balance: {
    type: Number,
    required: true,
  },
});

const Bank = mongoose.model('Bank', BankSchema);

module.exports = Bank;