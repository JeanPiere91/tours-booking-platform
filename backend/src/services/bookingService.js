const toursRepository = require('../data/toursRepository');
const addonsRepository = require('../data/addonsRepository');
const bookingsRepository = require('../repositories/bookingsRepository');
const pricingService = require('./pricingService');
const emailService = require('./emailService');
const bookingCode = require('../utils/bookingCode');

function pickAddons(ids = []) {
  const seen = new Set();
  const addons = [];
  ids.forEach((id) => {
    if (seen.has(id)) return;
    const addon = addonsRepository.findById(id);
    if (addon) {
      seen.add(id);
      addons.push(addon);
    }
  });
  return addons;
}

function summarisePassengers(passengers) {
  return passengers.reduce(
    (acc, p) => {
      const key = p.type === 'adult' ? 'adults' : p.type === 'child' ? 'children' : 'infants';
      acc[key] += 1;
      return acc;
    },
    { adults: 0, children: 0, infants: 0 },
  );
}

function buildBooking(input) {
  const tour = toursRepository.findBySlug(input.tourSlug);
  if (!tour) {
    const err = new Error(`Tour not found: ${input.tourSlug}`);
    err.status = 404;
    throw err;
  }

  const selectedAddons = pickAddons(input.addonIds);
  const totals = pricingService.calculate({
    tour,
    passengers: input.passengers,
    addons: selectedAddons,
  });

  const code = bookingCode.generate();
  const createdAt = new Date().toISOString();
  const holder = input.passengers.find((p) => p.type === 'adult') || input.passengers[0];

  return {
    code,
    createdAt,
    status: 'pending',
    tour: {
      slug: tour.slug,
      title: tour.title,
      route: tour.route,
      location: tour.location,
      durationLabel: tour.durationLabel,
      gradient: tour.gradient,
      priceUSD: tour.priceUSD,
    },
    date: input.date,
    departure: input.departure,
    passengers: summarisePassengers(input.passengers),
    passengerDetails: input.passengers,
    addons: totals.addons.map((a) => ({
      id: a.id,
      name: a.name,
      icon: a.icon,
      priceUSD: a.priceUSD,
      per: a.per,
      quantity: a.quantity,
      subtotal: a.subtotal,
    })),
    contact: {
      firstName: holder?.firstName || '',
      lastName: holder?.lastName || '',
      email: input.contact.email,
      phone: input.contact.phone,
      comments: input.contact.comments || '',
    },
    totals: {
      tourSubtotal: totals.tourSubtotal,
      addonsSubtotal: totals.addonsSubtotal,
      total: totals.total,
      unitPrices: totals.unitPrices,
      currency: totals.currency,
    },
  };
}

async function create(input) {
  const booking = buildBooking(input);
  bookingsRepository.save(booking);
  const emailResult = await emailService.sendBookingConfirmation(booking);
  booking.email = emailResult;
  bookingsRepository.save(booking);
  return booking;
}

function findByCode(code) {
  return bookingsRepository.findByCode(code);
}

module.exports = { create, findByCode };
