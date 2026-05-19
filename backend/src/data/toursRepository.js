const tours = require('./tours.json');

function matchesCategory(tour, category) {
  const list = Array.isArray(tour.categories) ? tour.categories : [];
  const normalized = category.toLowerCase();
  return list.some((cat) => cat.toLowerCase() === normalized);
}

function list({ category } = {}) {
  if (!category || category.toLowerCase() === 'all') {
    return tours;
  }
  return tours.filter((tour) => matchesCategory(tour, category));
}

function findBySlug(slug) {
  return tours.find((tour) => tour.slug === slug) || null;
}

function categories() {
  const set = new Set();
  tours.forEach((tour) => (tour.categories || []).forEach((cat) => set.add(cat)));
  return [...set].sort();
}

module.exports = { list, findBySlug, categories };
