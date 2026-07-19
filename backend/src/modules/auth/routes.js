const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../../db/pool');
const router = express.Router();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_secret';

// Mock OTP storage (In-memory for MVP)
const otps = {};

router.post('/otp/request', async (req, res) => {
  const { phone, role, name } = req.body;
  if (!phone || !role) return res.status(400).json({ error: 'Phone and role required' });

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otps[phone] = otp;
  
  // Log OTP for development
  console.log(`[SMS MOCK] Sending OTP ${otp} to ${phone}`);
  
  res.json({ message: 'OTP requested', success: true });
});

router.post('/otp/verify', async (req, res) => {
  const { phone, otp, role, name } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

  if (otps[phone] !== otp && otp !== '1234') { // '1234' as universal fallback for easy testing
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  try {
    // Upsert user
    let userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    let user = userResult.rows[0];

    if (!user) {
      const insertResult = await pool.query(
        'INSERT INTO users (phone, role, name) VALUES ($1, $2, $3)',
        [phone, role, name || '']
      );
      user = { id: insertResult.lastID, phone, role };
      
      if (role === 'driver') {
        await pool.query('INSERT INTO driver_profiles (user_id) VALUES ($1)', [user.id]);
      }
    }

    delete otps[phone]; // Consume OTP

    const token = jwt.sign({ id: user.id, role: user.role, phone: user.phone }, ACCESS_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
