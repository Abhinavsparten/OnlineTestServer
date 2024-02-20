const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/schema');

// Controller for user registration
exports.userRegister = async (req, res) => {
  const { uname, email, psw } = req.body;

  if (!uname || !email || !psw) {
    return res.status(400).json({ message: 'All inputs are required' });
  }

  try {
    const preUser = await User.findOne({ email });
    if (preUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(psw, 10);
    const newUser = new User({ uname, email, psw: hashedPassword });
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
      return res.status(404).json({ message: 'User not found' });
    }

    const id = preUser._id;
    const token = jwt.sign({ email }, 'secretkey123');

    const result = await bcrypt.compare(psw, preUser.psw);
    if (!result) {
      return res.status(401).json({ message: 'Incorrect Password' });
    }

    return res.status(200).json({ message: 'Login successful', token, id });
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
