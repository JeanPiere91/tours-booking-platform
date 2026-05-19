import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { fetchTourBySlug } from '../api/toursApi.js';
import BookingSidebar from '../components/BookingSidebar.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import ContentBlock from '../components/ContentBlock.jsx';
import Gallery from '../components/Gallery.jsx';
import IncludesList from '../components/IncludesList.jsx';
import Itinerary from '../components/Itinerary.jsx';
import StateMessage from '../components/StateMessage.jsx';

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
      <div className="page-section">
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

  const primaryCategory = tour.categories?.[0] || '';
  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Tours', to: '/tours' },
    primaryCategory ? { label: primaryCategory, to: `/tours?category=${encodeURIComponent(primaryCategory)}` } : null,
    { label: tour.title },
  ].filter(Boolean);

  return (
    <article className="tour-detail">
      <Breadcrumb items={breadcrumbs} />

      <section className="detail-hero">
        <div className="detail-hero__inner">
          <div className="detail-hero__head">
            <p className="detail-hero__route">{tour.route}</p>
            <h1 className="detail-hero__title">{tour.title}</h1>
            <ul className="detail-hero__meta">
              <li>
                <span aria-hidden="true">📍</span> {tour.location}
              </li>
              <li>
                <span aria-hidden="true">⏱</span> {tour.durationLabel}
              </li>
              {typeof tour.rating === 'number' && (
                <li aria-label={`Rated ${tour.rating} out of 5`}>
                  <span aria-hidden="true">⭐</span> {tour.rating.toFixed(1)} / 5
                  {tour.reviews ? ` (${tour.reviews} reviews)` : ''}
                </li>
              )}
            </ul>
          </div>

          <Gallery mainGradient={tour.gradient} />
        </div>
      </section>

      <div className="detail-body">
        <div className="detail-body__inner">
          <div className="detail-body__main">
            <ContentBlock title="About this tour">
              <p className="content-block__body">{tour.description}</p>
            </ContentBlock>

            {tour.itinerary?.length > 0 && (
              <ContentBlock title="Itinerary">
                <Itinerary items={tour.itinerary} />
              </ContentBlock>
            )}

            <ContentBlock title="What's included">
              <IncludesList includes={tour.highlights} excludes={tour.excludes} />
            </ContentBlock>
          </div>

          <div className="detail-body__sidebar">
            <BookingSidebar tour={tour} />
          </div>
        </div>
      </div>
    </article>
  );
}
