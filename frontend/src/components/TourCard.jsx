import { Link } from 'react-router-dom';

import { formatCurrency, formatDuration } from '../utils/format.js';

export default function TourCard({ tour }) {
  return (
    <Link to={`/tours/${tour.slug}`} className="tour-card" aria-label={`View details for ${tour.title}`}>
      <div className="tour-card__media">
        <img src={tour.imageUrl} alt="" loading="lazy" />
        <span className="tour-card__badge">{tour.category}</span>
      </div>
      <div className="tour-card__body">
        <div className="tour-card__meta">
          <span>{tour.location}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDuration(tour.durationDays)}</span>
        </div>
        <h3 className="tour-card__title">{tour.title}</h3>
        <p className="tour-card__summary">{tour.summary}</p>
        <div className="tour-card__footer">
          <span className="tour-card__price">
            {formatCurrency(tour.priceAUD)}
            <span className="tour-card__price-suffix"> · per person</span>
          </span>
          <span className="tour-card__rating" aria-label={`Rated ${tour.rating} out of 5`}>
            ★ {tour.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
