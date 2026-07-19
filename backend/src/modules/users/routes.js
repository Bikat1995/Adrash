const express = require('express');
const pool = require('../../db/pool');
const { requireAuth } = require('../../middleware/auth');
const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, phone, role, name, language_pref, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    
    let userProfile = result.rows[0];
    
    if (req.user.role === 'driver') {
      const driverResult = await pool.query('SELECT * FROM driver_profiles WHERE user_id = $1', [req.user.id]);
      userProfile.driver_profile = driverResult.rows[0];
    }
    
    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
