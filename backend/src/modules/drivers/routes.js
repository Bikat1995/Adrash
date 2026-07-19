const express = require('express');
const pool = require('../../db/pool');
const { requireAuth } = require('../../middleware/auth');
const router = express.Router();

router.use(requireAuth);

router.post('/ping', async (req, res) => {
  const { lat, lng } = req.body;
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Forbidden' });
  try {
    await pool.query(
      `UPDATE driver_profiles SET last_lat = $1, last_lng = $2, last_ping_at = CURRENT_TIMESTAMP WHERE user_id = $3`,
      [lat, lng, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/online', async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Forbidden' });
  try {
    await pool.query(`UPDATE driver_profiles SET is_online = 1 WHERE user_id = $1`, [req.user.id]);
    res.json({ success: true, is_online: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/offline', async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Forbidden' });
  try {
    await pool.query(`UPDATE driver_profiles SET is_online = 0 WHERE user_id = $1`, [req.user.id]);
    res.json({ success: true, is_online: false });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
