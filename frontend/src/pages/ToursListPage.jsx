import { useEffect, useMemo, useRef, useState } from 'react';

import { fetchTours } from '../api/toursApi.js';
import FilterChips from '../components/FilterChips.jsx';
import Hero from '../components/Hero.jsx';
import SectionHead from '../components/SectionHead.jsx';
import StateMessage from '../components/StateMessage.jsx';
import TourCard from '../components/TourCard.jsx';
import TourCardSkeleton from '../components/TourCardSkeleton.jsx';

const ALL_CATEGORY = 'All';
const CATEGORY_ORDER = [
  ALL_CATEGORY,
  'Machu Picchu',
  'Sacred Valley',
  'Adventure',
  'Day trip',
  'Multi-day',
];

export default function ToursListPage() {
  const [tours, setTours] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(ALL_CATEGORY);
  const toursRef = useRef(null);

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
    const present = new Set();
    tours.forEach((tour) => (tour.categories || []).forEach((cat) => present.add(cat)));
    const ordered = CATEGORY_ORDER.filter((cat) => cat === ALL_CATEGORY || present.has(cat));
    const extras = [...present].filter((cat) => !CATEGORY_ORDER.includes(cat)).sort();
    return [...ordered, ...extras];
  }, [tours]);

  const visibleTours = useMemo(() => {
    if (category === ALL_CATEGORY) return tours;
    return tours.filter((tour) => (tour.categories || []).includes(category));
  }, [tours, category]);

  const scrollToTours = () => {
    toursRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Hero onSearch={scrollToTours} />

      <section className="tours-section" ref={toursRef} id="tours">
        <div className="tours-section__inner">
          <SectionHead
            eyebrow="Catalogue"
            title="Our most"
            accent="popular tours"
          />

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
                  ? `${error.message}. Make sure the backend API is running on port 5000.`
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
      </section>
    </>
  );
}
