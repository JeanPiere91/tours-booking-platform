const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'tours-booking-backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
