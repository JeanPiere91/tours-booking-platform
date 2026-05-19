const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  return currencyFormatter.format(value);
}

export function formatDuration(days) {
  if (!days || days < 1) return 'Half day';
  if (days === 1) return '1 day';
  return `${days} days`;
}
