const express = require('express');

const toursRepository = require('../data/toursRepository');

const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  const tours = toursRepository.list({ category });
  res.json({
    count: tours.length,
    category: category || null,
    items: tours,
  });
});

router.get('/:slug', (req, res) => {
  const tour = toursRepository.findBySlug(req.params.slug);
  if (!tour) {
    return res.status(404).json({ error: 'Tour not found', slug: req.params.slug });
  }
  res.json(tour);
});

module.exports = router;
