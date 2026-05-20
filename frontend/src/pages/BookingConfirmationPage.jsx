import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import { fetchBookingByCode } from '../api/bookingsApi.js';
import Stepper from '../components/booking/Stepper.jsx';
import Ticket from '../components/booking/Ticket.jsx';
import StateMessage from '../components/StateMessage.jsx';

const WHATSAPP_URL = 'https://wa.me/51999999999';

export default function BookingConfirmationPage() {
  const { code } = useParams();
  const location = useLocation();
  const initial = location.state?.booking;
  const [booking, setBooking] = useState(initial || null);
  const [status, setStatus] = useState(initial ? 'ready' : 'loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    fetchBookingByCode(code)
      .then((data) => {
        if (cancelled) return;
        setBooking(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setStatus(err.status === 404 ? 'not-found' : 'error');
      });
    return () => {
      cancelled = true;
    };
  }, [code, initial]);

  if (status === 'loading') {
    return (
      <div className="detail-skeleton" aria-busy="true">
        <div className="skeleton skeleton--hero" />
        <div className="skeleton skeleton--line skeleton--title" />
        <div className="skeleton skeleton--line" />
      </div>
    );
  }

  if (status === 'not-found') {
    return (
      <div className="page-section">
        <StateMessage
          title="Booking not found"
          description={`We couldn't find a booking with code ${code}.`}
          action={
            <Link to="/tours" className="button">
              Browse tours
            </Link>
          }
        />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="page-section">
        <StateMessage
          title="Something went wrong"
          description={error?.message || 'Please try again in a moment.'}
          action={
            <Link to="/tours" className="button">
              Back to catalogue
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="booking-frame">
      <div className="booking-frame__inner">
        <Stepper currentStep="confirmation" />
        <div className="confirmation">
          <div className="confirmation__check" aria-hidden="true">✓</div>
          <h1 className="confirmation__title">Your booking is confirmed!</h1>
          <p className="confirmation__lede">
            Our team will contact you shortly to finalise the details of your tour.
          </p>

          <div className="code-box" aria-label={`Booking code ${booking.code}`}>
            <p className="code-box__label">Booking code</p>
            <p className="code-box__code">{booking.code}</p>
          </div>

          <Ticket booking={booking} />

          <div className="confirmation__actions">
            <Link to="/tours" className="button">
              ← Browse more tours
            </Link>
            <a className="button button--primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener">
              💬 Contact via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
