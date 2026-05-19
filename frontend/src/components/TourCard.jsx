import { Link } from 'react-router-dom';

import { formatPriceUSD } from '../utils/format.js';

export default function TourCard({ tour }) {
  const badgeVariant = tour.badge?.variant === 'brown' ? 'tour-tag--brown' : 'tour-tag--orange';
  const gradient = tour.gradient || 'andes';

  return (
    <Link
      to={`/tours/${tour.slug}`}
      className="tour-card"
      aria-label={`View details for ${tour.title}`}
    >
      <div className={`tour-img tour-img--${gradient}`} role="img" aria-label={tour.title}>
        {tour.badge && <span className={`tour-tag ${badgeVariant}`}>{tour.badge.label}</span>}
        <span className="tour-duration">
          <span aria-hidden="true">⏱</span> {tour.durationLabel}
        </span>
      </div>
      <div className="tour-body">
        <p className="tour-route">{tour.route}</p>
        <h3 className="tour-name">{tour.title}</h3>
        <p className="tour-desc">{tour.summary}</p>
        <div className="tour-foot">
          <div>
            <p className="price-from">From</p>
            <p className="price-num">
              {formatPriceUSD(tour.priceUSD)} <span>/ person</span>
            </p>
          </div>
          <span className="btn-view" aria-hidden="true">
            View tour →
          </span>
        </div>
      </div>
    </Link>
  );
}
