import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { fetchTourBySlug } from '../api/toursApi.js';
import StateMessage from '../components/StateMessage.jsx';
import { formatPriceUSD } from '../utils/format.js';

export default function TourDetailPage() {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);

    fetchTourBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setTour(data);
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
  }, [slug]);

  if (status === 'loading') {
    return (
      <div className="detail-skeleton" aria-busy="true">
        <div className="skeleton skeleton--hero" />
        <div className="skeleton skeleton--line skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--short" />
      </div>
    );
  }

  if (status === 'not-found') {
    return (
      <div className="tour-detail__layout">
        <StateMessage
          title="Tour not found"
          description="The tour you're looking for doesn't exist or is no longer available."
          action={
            <Link to="/tours" className="button">
              Back to catalogue
            </Link>
          }
        />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="tour-detail__layout">
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

  const primaryCategory = tour.categories?.[0] || '';

  return (
    <article className="tour-detail">
      <div className={`tour-detail__media tour-img--${tour.gradient || 'andes'}`} aria-hidden="true" />

      <div className="tour-detail__layout">
        <div className="tour-detail__main">
          <Link to="/tours" className="back-link">
            ← Back to catalogue
          </Link>
          {primaryCategory && <span className="tour-detail__badge">{primaryCategory}</span>}
          <h1 className="tour-detail__title">{tour.title}</h1>
          <p className="tour-detail__meta">
            <span>📍 {tour.location}</span>
            <span aria-hidden="true">·</span>
            <span>⏱ {tour.durationLabel}</span>
            {typeof tour.rating === 'number' && (
              <>
                <span aria-hidden="true">·</span>
                <span aria-label={`Rated ${tour.rating} out of 5`}>
                  ⭐ {tour.rating.toFixed(1)}
                  {tour.reviews ? ` (${tour.reviews} reviews)` : ''}
                </span>
              </>
            )}
          </p>

          <p className="tour-detail__lede">{tour.summary}</p>
          <p className="tour-detail__description">{tour.description}</p>

          {tour.highlights?.length > 0 && (
            <section className="tour-detail__section">
              <h2>What's included</h2>
              <ul className="highlights-list">
                {tour.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="tour-detail__sidebar" aria-label="Price">
          <div className="price-card">
            <p className="price-card__label">From</p>
            <p className="price-card__amount">{formatPriceUSD(tour.priceUSD)}</p>
            <p className="price-card__suffix">per person</p>
            <button type="button" className="button button--primary" disabled>
              Bookings open next sprint
            </button>
            <p className="price-card__note">
              The booking flow ships in the next sprint. For now you can review all the details of
              this tour.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
