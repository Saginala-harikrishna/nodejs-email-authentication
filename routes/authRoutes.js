const express = require('express');
const router = express.Router();

// Import all necessary controller functions at once
const { sendOTP, verifyOTP, loginUser, resetPassword } = require('../controllers/authController');


// Route to send OTP to user's email
router.post('/send-otp', sendOTP);

// Route to verify OTP and register user
router.post('/verify-otp', verifyOTP);

// Route to log in user
router.post('/login', loginUser);

// Route to reset password using OTP
router.post('/reset-password', resetPassword);


module.exports = router;
