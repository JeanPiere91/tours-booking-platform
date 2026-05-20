const addons = require('./addons.json');

function list() {
  return addons;
}

function findById(id) {
  return addons.find((a) => a.id === id) || null;
}

module.exports = { list, findById };
