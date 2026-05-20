import { formatPriceUSD } from '../../utils/format.js';

function formatPax(p) {
  const parts = [];
  if (p.adults) parts.push(`${p.adults} adult${p.adults !== 1 ? 's' : ''}`);
  if (p.children) parts.push(`${p.children} child${p.children !== 1 ? 'ren' : ''}`);
  if (p.infants) parts.push(`${p.infants} infant${p.infants !== 1 ? 's' : ''}`);
  return parts.join(' · ');
}

function formatAddons(addons) {
  if (!addons?.length) return 'None';
  return addons
    .map((a) => `${a.name}${a.quantity > 1 ? ` × ${a.quantity}` : ''}`)
    .join(' · ');
}

export default function Ticket({ booking }) {
  return (
    <article className="ticket">
      <header className="ticket__header">
        <span className="logo-mark" aria-hidden="true">IPA</span>
        <div>
          <h2 className="ticket__title">{booking.tour.title}</h2>
          <p className="ticket__location">{booking.tour.location}</p>
        </div>
      </header>

      <dl className="ticket__rows">
        <div className="ticket__row">
          <dt>Date</dt>
          <dd>{booking.date} · {booking.departure}</dd>
        </div>
        <div className="ticket__row">
          <dt>Passengers</dt>
          <dd>{formatPax(booking.passengers)}</dd>
        </div>
        <div className="ticket__row">
          <dt>Extras</dt>
          <dd>{formatAddons(booking.addons)}</dd>
        </div>
        <div className="ticket__row">
          <dt>Meeting point</dt>
          <dd>Your hotel in {booking.tour.location?.split(',')[0] || 'Cusco'}</dd>
        </div>
        <div className="ticket__row">
          <dt>Holder</dt>
          <dd>{booking.contact.firstName} {booking.contact.lastName}</dd>
        </div>
      </dl>

      <div className="ticket__total">
        <span className="ticket__total-label">Estimated total</span>
        <span className="ticket__total-amount">
          {formatPriceUSD(booking.totals.total)}
        </span>
      </div>

      <p className="ticket__email-note">
        <span className="ticket__email-icon" aria-hidden="true">✉</span>
        {booking.email?.sent ? (
          <span>
            Confirmation sent to <strong>{booking.contact.email}</strong>. Check your spam folder
            too.
          </span>
        ) : (
          <span>
            We saved your booking. Email sending is disabled in this environment — once it's
            configured, the confirmation will arrive at <strong>{booking.contact.email}</strong>.
          </span>
        )}
      </p>
    </article>
  );
}
