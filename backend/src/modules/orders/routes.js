const express = require('express');
const router = express.Router();

router.post('/', (req, res) => res.json({ message: 'Order created' }));
router.get('/nearby', (req, res) => res.json({ orders: [] }));
router.get('/:id', (req, res) => res.json({ id: req.params.id }));
router.post('/:id/accept', (req, res) => res.json({ message: 'Order accepted' }));
router.post('/:id/status', (req, res) => res.json({ message: 'Order status updated' }));
router.post('/:id/cancel', (req, res) => res.json({ message: 'Order cancelled' }));
router.post('/:id/rate', (req, res) => res.json({ message: 'Order rated' }));

module.exports = router;
