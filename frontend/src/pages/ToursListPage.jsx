import { useEffect, useMemo, useState } from 'react';

import { fetchTours } from '../api/toursApi.js';
import FilterChips from '../components/FilterChips.jsx';
import StateMessage from '../components/StateMessage.jsx';
import TourCard from '../components/TourCard.jsx';
import TourCardSkeleton from '../components/TourCardSkeleton.jsx';

const ALL_CATEGORY = 'All';

export default function ToursListPage() {
  const [tours, setTours] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(ALL_CATEGORY);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);

    fetchTours()
      .then((data) => {
        if (cancelled) return;
        setTours(data.items || []);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(tours.map((tour) => tour.category));
    return [ALL_CATEGORY, ...[...unique].sort()];
  }, [tours]);

  const visibleTours = useMemo(() => {
    if (category === ALL_CATEGORY) return tours;
    return tours.filter((tour) => tour.category === category);
  }, [tours, category]);

  return (
    <div className="container">
      <section className="hero">
        <p className="hero__eyebrow">Sprint 1 · Public catalog</p>
        <h1 className="hero__title">Find your next adventure</h1>
        <p className="hero__lede">
          Hand-picked guided tours across every continent. Browse the catalog, filter by what you
          love, and dive into the details.
        </p>
      </section>

      {status !== 'error' && (
        <FilterChips categories={categories} value={category} onChange={setCategory} />
      )}

      {status === 'loading' && (
        <div className="tour-grid" aria-busy="true">
          {Array.from({ length: 6 }).map((_, idx) => (
            <TourCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {status === 'error' && (
        <StateMessage
          title="We couldn't load the tours"
          description={
            error?.message
              ? `${error.message}. Make sure the backend API is running on port 4000.`
              : 'Please try again in a moment.'
          }
        />
      )}

      {status === 'ready' && visibleTours.length === 0 && (
        <StateMessage
          title="No tours match this filter"
          description="Try a different category to see more results."
        />
      )}

      {status === 'ready' && visibleTours.length > 0 && (
        <div className="tour-grid">
          {visibleTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
}
