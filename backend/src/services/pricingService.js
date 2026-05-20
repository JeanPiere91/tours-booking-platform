function countByType(passengers) {
  const counts = { adult: 0, child: 0, infant: 0 };
  passengers.forEach((p) => {
    if (counts[p.type] !== undefined) counts[p.type] += 1;
  });
  return counts;
}

function tourSubtotal(tour, counts) {
  const adultPrice = tour.priceUSD;
  const childPrice = Math.round(tour.priceUSD * 0.5);
  return {
    adultPrice,
    childPrice,
    infantPrice: 0,
    subtotal: adultPrice * counts.adult + childPrice * counts.child,
  };
}

function addonsSubtotal(selectedAddons, counts) {
  const payingPax = counts.adult + counts.child;
  return selectedAddons.map((addon) => {
    const qty = addon.per === 'passenger' ? payingPax : 1;
    return {
      ...addon,
      quantity: qty,
      subtotal: addon.priceUSD * qty,
    };
  });
}

function calculate({ tour, passengers, addons: selectedAddons = [] }) {
  const counts = countByType(passengers);
  const { adultPrice, childPrice, infantPrice, subtotal: tourSub } = tourSubtotal(tour, counts);
  const addonLines = addonsSubtotal(selectedAddons, counts);
  const addonsSub = addonLines.reduce((sum, line) => sum + line.subtotal, 0);

  return {
    counts,
    unitPrices: { adult: adultPrice, child: childPrice, infant: infantPrice },
    tourSubtotal: tourSub,
    addons: addonLines,
    addonsSubtotal: addonsSub,
    total: tourSub + addonsSub,
    currency: tour.currency || 'USD',
  };
}

module.exports = { calculate };
