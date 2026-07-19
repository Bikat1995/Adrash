const express = require('express');
const router = express.Router();

router.post('/ping', (req, res) => res.json({ message: 'Ping recorded' }));
router.post('/online', (req, res) => res.json({ message: 'Driver online' }));
router.post('/offline', (req, res) => res.json({ message: 'Driver offline' }));

module.exports = router;
