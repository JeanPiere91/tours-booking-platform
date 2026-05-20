const crypto = require('crypto');

// Avoid ambiguous chars (0/O, 1/I/L) to keep codes readable when typed by phone.
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

function randomSegment(length = 6) {
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

function generate(date = new Date()) {
  const year = date.getUTCFullYear();
  return `IPA-${year}-${randomSegment(6)}`;
}

module.exports = { generate };
