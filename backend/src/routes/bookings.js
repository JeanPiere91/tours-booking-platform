const express = require('express');

const bookingService = require('../services/bookingService');
const { validate } = require('../validation/bookingValidator');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const errors = validate(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Invalid booking request', details: errors });
  }

  try {
    const booking = await bookingService.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
});

router.get('/:code', (req, res) => {
  const booking = bookingService.findByCode(req.params.code);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found', code: req.params.code });
  }
  res.json(booking);
});

module.exports = router;
