import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PassengerCounter from './PassengerCounter.jsx';
import { formatPriceUSD } from '../utils/format.js';

const PAX_TYPES = [
  { key: 'adults', category: 'Adult', subtitle: '12 years and over', factor: 1, min: 1 },
  { key: 'children', category: 'Child', subtitle: 'Ages 3 to 11', factor: 0.5, min: 0 },
  { key: 'infants', category: 'Infant', subtitle: 'Ages 0 to 2', factor: 0, min: 0 },
];

function defaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BookingSidebar({ tour }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ adults: 2, children: 1, infants: 0 });
  const [date, setDate] = useState(defaultDate());
  const [departure, setDeparture] = useState(tour.departureLabel || 'Morning');

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
  const canBook = counts.adults >= 1 && Boolean(date) && Boolean(departure);

  const onBook = () => {
    if (!canBook) return;
    navigate(`/booking/${tour.slug}`, {
      state: {
        date,
        departure,
        counts,
        prettyDate: formatDate(date),
      },
    });
  };

  return (
    <aside className="booking-card" aria-label="Booking">
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
        <input
          id="tour-date"
          type="date"
          className="field__input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().slice(0, 10)}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="tour-departure">
          <span aria-hidden="true">🕐</span> Departure
        </label>
        <select
          id="tour-departure"
          className="field__input"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        >
          <option value={tour.departureLabel || 'Morning'}>{tour.departureLabel || 'Morning'}</option>
        </select>
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
          onClick={onBook}
          disabled={!canBook}
        >
          Book this tour <span aria-hidden="true">→</span>
        </button>
        {!canBook && (
          <p className="booking-card__note">At least one adult is required to book.</p>
        )}
      </div>
    </aside>
  );
}
