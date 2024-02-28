const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/schema');

// Controller for user registration
exports.userRegister = async (req, res) => {
  const { uname, email, psw,isPremium } = req.body;

  if (!uname || !email || !psw || !isPremium) {
    return res.status(400).json({ message: 'All inputs are required' });
  }

  try {
    const preUser = await User.findOne({ email });
    if (preUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(psw, 10);
    const newUser = new User({ uname, email, psw: hashedPassword,isPremium });
    await newUser.save();

    return res.status(201).json({ message: 'Registration successful', newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Controller for user login
exports.userLogin = async (req, res) => {
  const { email, psw } = req.body;

  if (!email || !psw) {
    return res.status(400).json({ message: 'All inputs are required' });
  }

  try {
    const preUser = await User.findOne({ email });
    if (!preUser) {
      return res.send({ message: 'User not found' });
    }

    const id = preUser._id;
    const uname = preUser.uname;
    //token generation
    const token = jwt.sign({ email }, 'secretkey123');
    //comparing password
    const result = await bcrypt.compare(psw, preUser.psw);
    if (!result) {
      return res.send({ message: 'Incorrect Password' });
    }

    return res.status(200).json({ message: 'Login successful', token, id,uname });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Controller for email verification
exports.emailVerify = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const preUser = await User.findOne({ email });
    if (!preUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const uid = preUser._id;
    //triggering email to perticuler mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.USER, pass: process.env.PASSWORD }
    });

    const mailOptions = {
      from: 'OnlineTestapp.in <demo@g.com>',
      to: email,
      subject: 'Verify your email',
      text: `${process.env.FRONTEND_URL}/updatepass/${uid}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send email' });
      }
      return res.status(200).json({ message: 'Check your email for password reset instructions' });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Controller for updating password
exports.updatePassword = async (req, res) => {
  const { psw, id } = req.body;

  if (!psw || !id) {
    return res.status(400).json({ message: 'Password and ID are required' });
  }

  try {
    //hash the password
    const hashedPassword = await bcrypt.hash(psw, 10);
    const preUser = await User.findOneAndUpdate({ _id: id }, { psw: hashedPassword });

    if (!preUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Controller for getting current user
exports.getCurrentUser = async (req, res) => {
  const { uid } = req.params;
  try {
    const userData = await User.findOne({ _id:uid });
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// Controller for deleting user
exports.deleteUser = async (req, res) => {
  const { uid } = req.params;
  try {
    const deletedCandidate = await User.findByIdAndDelete({ _id: uid});
    if (!deletedCandidate) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};