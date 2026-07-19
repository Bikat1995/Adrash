const express = require('express');
const pool = require('../../db/pool');
const { requireAuth } = require('../../middleware/auth');
const router = express.Router();

router.use(requireAuth);

router.post('/', async (req, res) => {
  const { pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, item_description } = req.body;
  if (req.user.role !== 'vendor') return res.status(403).json({ error: 'Only vendors can create orders' });

  try {
    const result = await pool.query(
      `INSERT INTO orders (vendor_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, item_description) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [req.user.id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, item_description]
    );
    res.json({ id: result.lastID, status: 'requested' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/nearby', async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Only drivers can view nearby orders' });
  try {
    const result = await pool.query(`SELECT * FROM orders WHERE status = 'requested'`);
    res.json({ orders: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/:id/accept', async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Only drivers can accept orders' });
  try {
    // Basic concurrency check
    const orderCheck = await pool.query('SELECT status FROM orders WHERE id = $1', [req.params.id]);
    if (!orderCheck.rows.length || orderCheck.rows[0].status !== 'requested') {
      return res.status(400).json({ error: 'Order already taken or invalid' });
    }

    await pool.query(
      `UPDATE orders SET status = 'matched', driver_id = $1, matched_at = CURRENT_TIMESTAMP WHERE id = $2 AND status = 'requested'`,
      [req.user.id, req.params.id]
    );
    res.json({ success: true, message: 'Order accepted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Forbidden' });
  try {
    let query = `UPDATE orders SET status = $1`;
    let params = [status, req.params.id, req.user.id];
    if (status === 'delivered') query += `, delivered_at = CURRENT_TIMESTAMP`;
    query += ` WHERE id = $2 AND driver_id = $3`;
    
    const result = await pool.query(query, params);
    if (result.rowCount === 0) return res.status(400).json({ error: 'Cannot update order' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/:id/cancel', async (req, res) => {
  if (req.user.role !== 'vendor') return res.status(403).json({ error: 'Forbidden' });
  try {
    const result = await pool.query(
      `UPDATE orders SET status = 'cancelled' WHERE id = $1 AND vendor_id = $2 AND status = 'requested'`,
      [req.params.id, req.user.id]
    );
    if (result.rowCount === 0) return res.status(400).json({ error: 'Cannot cancel order' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/:id/dispute', async (req, res) => {
  const { reason } = req.body;
  try {
    const result = await pool.query(
      `UPDATE orders SET status = 'disputed' WHERE id = $1`,
      [req.params.id]
    );
    console.log(`[DISPUTE] Order ${req.params.id} disputed. Reason: ${reason}`);
    res.json({ success: true, message: 'Dispute submitted for manual review' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
