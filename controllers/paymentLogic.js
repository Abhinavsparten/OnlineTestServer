const Bank = require('../models/bankAccount');
const User = require('../models/schema');

exports.paymentLogics = async (req, res) => {
  const { accno, toaccno, psw, amount,uid } = req.body;

  try {
    const userResult = await Bank.findOne({ accno,psw });
    if (!userResult) {
      return res.send({
        message: "Invalid Account Number or Password",
        status: false,
        statusCode: 404
      });
    }

    const receiverResult = await Bank.findOne({ accno: toaccno });
    if (!receiverResult) {
      return res.send({
        message: "Invalid Receiver Account Number",
        status: false,
        statusCode: 404
      });
    }

    if (amount > userResult.balance) {
      return res.send({
        message: "Insufficient Balance",
        status: false,
        statusCode: 404
      });
    }

    userResult.balance -= amount;
    await userResult.save();

    receiverResult.balance += amount;
    await receiverResult.save();
    //for chaging user to premium user
    const preuser = await User.findOne({ _id: uid })
    if (preuser) {
        preuser.isPremium = "yes",
        preuser.save()
    }

    return res.status(200).send({
      message: "Transaction Success, You are now premium member",
      status: true,
      statusCode: 200,
      balance: userResult.balance
    });
  } catch (error) {
    return res.send({
      message: "Error occurred while processing transaction",
      status: false,
      statusCode: 500,
      error: error.message
    });
  }
};


