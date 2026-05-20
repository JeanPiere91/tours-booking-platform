const express = require('express');

const addonsRepository = require('../data/addonsRepository');

const router = express.Router();

router.get('/', (req, res) => {
  const items = addonsRepository.list();
  res.json({ count: items.length, items });
});

module.exports = router;
