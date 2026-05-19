import { useMemo, useState } from 'react';

import PassengerCounter from './PassengerCounter.jsx';
import { formatPriceUSD } from '../utils/format.js';

const DEFAULT_DATE_LABEL = 'Jun 15, 2026';

const PAX_TYPES = [
  { key: 'adults', category: 'Adult', subtitle: '12 years and over', factor: 1, min: 1 },
  { key: 'children', category: 'Child', subtitle: 'Ages 3 to 11', factor: 0.5, min: 0 },
  { key: 'infants', category: 'Infant', subtitle: 'Ages 0 to 2', factor: 0, min: 0 },
];

export default function BookingSidebar({ tour }) {
  const [counts, setCounts] = useState({ adults: 2, children: 1, infants: 0 });

  const setCount = (key) => (value) => setCounts((prev) => ({ ...prev, [key]: value }));

  const lines = useMemo(() => {
    return PAX_TYPES.map((type) => {
      const qty = counts[type.key];
      if (!qty) return null;
      const unitPrice = Math.round(tour.priceUSD * type.factor);
      const subtotal = unitPrice * qty;
      return {
        key: type.key,
        label: `${qty} ${type.category}${qty > 1 ? 's' : ''}${unitPrice > 0 ? ` × ${formatPriceUSD(unitPrice)}` : ' (free)'}`,
        amount: subtotal,
      };
    }).filter(Boolean);
  }, [counts, tour.priceUSD]);

  const total = lines.reduce((sum, line) => sum + line.amount, 0);

  return (
    <aside className="booking-card" aria-label="Booking summary">
      <div className="booking-card__price">
        <p className="booking-card__price-label">From</p>
        <p className="booking-card__price-amount">
          {formatPriceUSD(tour.priceUSD)} <span>/ person</span>
        </p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="tour-date">
          <span aria-hidden="true">📅</span> Tour date
        </label>
        <button id="tour-date" type="button" className="field__input field__input--button">
          {DEFAULT_DATE_LABEL}
        </button>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="tour-departure">
          <span aria-hidden="true">🕐</span> Departure
        </label>
        <button id="tour-departure" type="button" className="field__input field__input--button">
          {tour.departureLabel || 'Morning'}
        </button>
      </div>

      <div className="field">
        <p className="field__label">
          <span aria-hidden="true">👥</span> Passengers
        </p>
        <div className="pax-list">
          {PAX_TYPES.map((type) => (
            <PassengerCounter
              key={type.key}
              category={type.category}
              subtitle={type.subtitle}
              value={counts[type.key]}
              onChange={setCount(type.key)}
              min={type.min}
            />
          ))}
        </div>
      </div>

      <div className="total-strip">
        {lines.map((line) => (
          <div key={line.key} className="total-strip__line">
            <span>{line.label}</span>
            <span>{formatPriceUSD(line.amount)}</span>
          </div>
        ))}
        <div className="total-strip__line total-strip__line--total">
          <span>Estimated total</span>
          <strong>{formatPriceUSD(total)}</strong>
        </div>

        <button
          type="button"
          className="btn-reserve"
          aria-disabled="true"
          onClick={(e) => e.preventDefault()}
        >
          Book this tour <span aria-hidden="true">→</span>
        </button>
        <p className="booking-card__note">Bookings open next sprint.</p>
      </div>
    </aside>
  );
}
