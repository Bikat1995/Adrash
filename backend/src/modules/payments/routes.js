const express = require('express');
const { requireAuth } = require('../../middleware/auth');
const pool = require('../../db/pool');
const router = express.Router();

// Mock Chapa Escrow Initialization
router.post('/checkout', requireAuth, async (req, res) => {
  const { order_id, amount } = req.body;
  
  if (req.user.role !== 'vendor') return res.status(403).json({ error: 'Forbidden' });

  // In a real implementation, we would call Chapa API:
  // POST https://api.chapa.co/v1/transaction/initialize
  // with Authorization: Bearer CHAPA_SECRET_KEY
  
  console.log(`[CHAPA MOCK] Initialized payment for Order ${order_id} with amount ${amount}`);
  
  res.json({
    message: 'Checkout initialized successfully',
    status: 'success',
    data: {
      checkout_url: `https://checkout.chapa.co/mock-checkout/${order_id}`
    }
  });
});

// Mock Chapa Webhook
router.post('/webhook', express.json(), async (req, res) => {
  const { event, tx_ref, status } = req.body;
  
  // Verify Chapa signature in a real implementation
  // const hash = crypto.createHmac('sha256', CHAPA_SECRET).update(JSON.stringify(req.body)).digest('hex');
  
  console.log(`[CHAPA MOCK] Webhook received for TX ${tx_ref} - Status: ${status}`);
  
  if (status === 'success') {
    // Escrow logic: mark order as paid
    // Update db logic here
  }

  res.sendStatus(200);
});

module.exports = router;
