const express = require('express');
const router = express.Router();

router.post('/otp/request', (req, res) => {
  res.json({ message: 'OTP requested' });
});

router.post('/otp/verify', (req, res) => {
  res.json({ token: 'mock-jwt-token', refreshToken: 'mock-refresh-token' });
});

module.exports = router;
