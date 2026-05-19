export function formatPriceUSD(value) {
  if (typeof value !== 'number') return '';
  return `USD ${value.toLocaleString('en-US')}`;
}

export function formatRating(rating) {
  if (typeof rating !== 'number') return '';
  return rating.toFixed(1);
}
