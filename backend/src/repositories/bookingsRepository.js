// Sprint 2: in-memory store. Will move to a real database in a later sprint.
const bookings = new Map();

function save(booking) {
  bookings.set(booking.code, booking);
  return booking;
}

function findByCode(code) {
  return bookings.get(code) || null;
}

function listAll() {
  return [...bookings.values()];
}

module.exports = { save, findByCode, listAll };
