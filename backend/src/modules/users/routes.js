const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    id: 1,
    name: 'Test User',
    role: 'vendor',
    phone: '+251911234567',
    language_pref: 'en'
  });
});

module.exports = router;
