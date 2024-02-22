const express = require('express');
const { marksAdd, getMarksAll } = require('../controllers/markLogics');
const { userRegister, userLogin, emailVerify, updatePassword,deleteUser } = require('../controllers/userLogics');
const { decodeToken } = require('../middleware/auth');

// Create an instance of the Router class
const router = express.Router();

// Route for user registration
router.post('/api/v1/register', userRegister);

// Route for user login
router.post('/api/v1/login', userLogin);

// Route for adding marks
router.post('/api/v1/add-marks',decodeToken, marksAdd);

// Route for getting all marks
router.get('/api/v1/get-marks/:uid',decodeToken, getMarksAll);

// Route for email verification
router.post('/api/v1/verifymail', emailVerify);

// Route for updating password
router.post('/api/v1/updatepass', updatePassword);

//route for delete rejected candidate
router.delete('/api/delete-user/:uid',decodeToken, deleteUser)

module.exports = router;
