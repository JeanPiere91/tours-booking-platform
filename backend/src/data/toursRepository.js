const tours = require('./tours.json');

function list({ category } = {}) {
  if (!category || category.toLowerCase() === 'all') {
    return tours;
  }
  const normalized = category.toLowerCase();
  return tours.filter((tour) => tour.category.toLowerCase() === normalized);
}

function findBySlug(slug) {
  return tours.find((tour) => tour.slug === slug) || null;
}

function categories() {
  return [...new Set(tours.map((tour) => tour.category))].sort();
}

module.exports = { list, findBySlug, categories };
