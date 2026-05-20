import { formatPriceUSD } from '../../utils/format.js';

function paxLine(counts) {
  const parts = [];
  if (counts.adults) parts.push(`${counts.adults} adult${counts.adults !== 1 ? 's' : ''}`);
  if (counts.children) parts.push(`${counts.children} child${counts.children !== 1 ? 'ren' : ''}`);
  if (counts.infants) parts.push(`${counts.infants} infant${counts.infants !== 1 ? 's' : ''}`);
  return parts.join(' · ');
}

export default function BookingSummary({
  tour,
  date,
  departure,
  counts,
  lines,
  total,
  ctaLabel,
  onSubmit,
  submitDisabled = false,
  submitLoading = false,
}) {
  return (
    <aside className="summary-card" aria-label="Booking summary">
      <h2 className="summary-card__heading">Booking summary</h2>

      <div className="summary-card__tour">
        <div className={`summary-card__thumb tour-img--${tour.gradient || 'andes'}`} aria-hidden="true" />
        <div>
          <h3 className="summary-card__title">{tour.title}</h3>
          <p className="summary-card__meta">
            <span aria-hidden="true">📅</span> {date} · {departure}
          </p>
          <p className="summary-card__meta">
            <span aria-hidden="true">👥</span> {paxLine(counts) || 'No passengers yet'}
          </p>
        </div>
      </div>

      {lines.length > 0 && (
        <div className="summary-card__rows">
          {lines.map((line) => (
            <div key={line.key} className="summary-card__row">
              <span className="summary-card__row-label">{line.label}</span>
              <span>{formatPriceUSD(line.amount)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="summary-card__total">
        <span className="summary-card__total-label">Total</span>
        <span className="summary-card__total-amount">{formatPriceUSD(total)}</span>
      </div>

      {ctaLabel && (
        <button
          type="button"
          className="btn-reserve"
          onClick={onSubmit}
          disabled={submitDisabled || submitLoading}
          aria-busy={submitLoading || undefined}
        >
          {submitLoading ? 'Sending booking…' : ctaLabel}
        </button>
      )}
    </aside>
  );
}
