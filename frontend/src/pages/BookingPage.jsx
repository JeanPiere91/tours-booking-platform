import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { fetchTourBySlug } from '../api/toursApi.js';
import { createBooking, fetchAddons } from '../api/bookingsApi.js';
import AddonsList from '../components/booking/AddonsList.jsx';
import BookingSummary from '../components/booking/BookingSummary.jsx';
import ContactForm from '../components/booking/ContactForm.jsx';
import PassengerForm from '../components/booking/PassengerForm.jsx';
import Stepper from '../components/booking/Stepper.jsx';
import StateMessage from '../components/StateMessage.jsx';
import { formatPriceUSD } from '../utils/format.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function defaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function defaultDraftFor(tour) {
  return {
    date: defaultDate(),
    departure: tour.departureLabel || 'Morning',
    counts: { adults: 1, children: 0, infants: 0 },
  };
}

function makePassenger(type, index) {
  return {
    id: `${type}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    firstName: '',
    lastName: '',
    documentType: 'passport',
    documentNumber: '',
    nationality: '',
    dateOfBirth: '',
  };
}

function seedPassengers(counts) {
  const list = [];
  for (let i = 0; i < (counts.adults || 0); i += 1) list.push(makePassenger('adult', i));
  for (let i = 0; i < (counts.children || 0); i += 1) list.push(makePassenger('child', i));
  for (let i = 0; i < (counts.infants || 0); i += 1) list.push(makePassenger('infant', i));
  return list;
}

function summariseCounts(passengers) {
  return passengers.reduce(
    (acc, p) => {
      const key = p.type === 'adult' ? 'adults' : p.type === 'child' ? 'children' : 'infants';
      acc[key] += 1;
      return acc;
    },
    { adults: 0, children: 0, infants: 0 },
  );
}

function calcLines(tour, counts, selectedAddons) {
  const lines = [];
  const adultPrice = tour.priceUSD;
  const childPrice = Math.round(tour.priceUSD * 0.5);
  if (counts.adults) {
    lines.push({
      key: 'adults',
      label: `${counts.adults} Adult${counts.adults !== 1 ? 's' : ''} × ${formatPriceUSD(adultPrice)}`,
      amount: adultPrice * counts.adults,
    });
  }
  if (counts.children) {
    lines.push({
      key: 'children',
      label: `${counts.children} Child${counts.children !== 1 ? 'ren' : ''} × ${formatPriceUSD(childPrice)}`,
      amount: childPrice * counts.children,
    });
  }
  selectedAddons.forEach((addon) => {
    const qty = addon.per === 'passenger' ? counts.adults + counts.children : 1;
    lines.push({
      key: `addon-${addon.id}`,
      label: `${addon.name}${qty > 1 ? ` × ${qty}` : ''}`,
      amount: addon.priceUSD * qty,
    });
  });
  return lines;
}

export default function BookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialDraftFromState = location.state;
  const initializedRef = useRef(false);

  const [tour, setTour] = useState(null);
  const [addons, setAddons] = useState([]);
  const [draft, setDraft] = useState(initialDraftFromState || null);
  const [step, setStep] = useState('passengers');
  const [passengers, setPassengers] = useState([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState([]);
  const [contact, setContact] = useState({ email: '', phone: '', comments: '', acceptTerms: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchTourBySlug(slug), fetchAddons()])
      .then(([tourData, addonsData]) => {
        if (cancelled) return;
        setTour(tourData);
        setAddons(addonsData.items || []);

        if (!initializedRef.current) {
          const effective = initialDraftFromState || defaultDraftFor(tourData);
          setDraft(effective);
          setPassengers(seedPassengers(effective.counts));
          initializedRef.current = true;
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, initialDraftFromState]);

  const counts = useMemo(() => summariseCounts(passengers), [passengers]);

  const selectedAddons = useMemo(
    () => addons.filter((a) => selectedAddonIds.includes(a.id)),
    [addons, selectedAddonIds],
  );

  const lines = useMemo(
    () => (tour ? calcLines(tour, counts, selectedAddons) : []),
    [tour, counts, selectedAddons],
  );

  const total = lines.reduce((sum, l) => sum + l.amount, 0);

  if (loadError) {
    return (
      <div className="page-section">
        <StateMessage
          title="We couldn't load the booking page"
          description={loadError.message}
          action={
            <Link to={`/tours/${slug}`} className="button">
              Back to the tour
            </Link>
          }
        />
      </div>
    );
  }

  if (!tour || !draft) {
    return (
      <div className="detail-skeleton" aria-busy="true">
        <div className="skeleton skeleton--hero" />
        <div className="skeleton skeleton--line skeleton--title" />
        <div className="skeleton skeleton--line" />
      </div>
    );
  }

  const updatePassenger = (id, patch) => {
    setPassengers((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const toggleAddon = (id) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const validatePassengersStep = () => {
    const newErrors = {};
    passengers.forEach((p, index) => {
      if (!p.firstName.trim()) newErrors[`passengers[${index}].firstName`] = 'Required';
      if (!p.lastName.trim()) newErrors[`passengers[${index}].lastName`] = 'Required';
      if (!p.documentNumber.trim()) newErrors[`passengers[${index}].documentNumber`] = 'Required';
      if (p.type === 'adult' && !p.nationality.trim()) {
        newErrors[`passengers[${index}].nationality`] = 'Required';
      }
      if ((p.type === 'child' || p.type === 'infant') && !p.dateOfBirth) {
        newErrors[`passengers[${index}].dateOfBirth`] = 'Required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateContactStep = () => {
    const newErrors = {};
    if (!EMAIL_RE.test(contact.email)) newErrors['contact.email'] = 'A valid email is required.';
    if (!contact.phone.trim()) newErrors['contact.phone'] = 'Phone is required.';
    if (!contact.acceptTerms) newErrors['contact.acceptTerms'] = 'You must accept the terms.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (step === 'passengers') {
      if (validatePassengersStep()) setStep('contact');
    }
  };

  const goBack = () => {
    if (step === 'contact') {
      setStep('passengers');
      setErrors({});
      return;
    }
    navigate(`/tours/${slug}`);
  };

  const submit = async () => {
    if (!validateContactStep()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        tourSlug: slug,
        date: draft.date,
        departure: draft.departure,
        passengers: passengers.map(({ id, ...rest }) => rest),
        addonIds: selectedAddonIds,
        contact: {
          email: contact.email,
          phone: contact.phone,
          comments: contact.comments,
          acceptTerms: contact.acceptTerms,
        },
      };
      const booking = await createBooking(payload);
      navigate(`/bookings/${booking.code}`, { state: { booking }, replace: true });
    } catch (err) {
      console.error(err);
      setSubmitError(err);
      if (err.details?.length) {
        const fieldErrors = {};
        err.details.forEach((d) => {
          fieldErrors[d.path] = d.message;
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const ctaLabel = step === 'passengers' ? 'Continue to step 3 →' : 'Confirm booking →';
  const onSubmit = step === 'passengers' ? goNext : submit;
  const submitLoading = submitting;

  return (
    <div className="booking-frame">
      <div className="booking-frame__inner">
        <Stepper currentStep={step} />

        {submitError && !errors['contact.email'] && (
          <div className="alert alert--error" role="alert">
            {submitError.message || 'Could not submit the booking. Please try again.'}
          </div>
        )}

        <div className="booking-grid">
          <div className="booking-grid__main">
            {step === 'passengers' && (
              <>
                <section className="booking-card-step">
                  <h2 className="booking-card-step__title">Passenger details</h2>
                  <p className="booking-card-step__hint">
                    Enter the details exactly as they appear on each passenger's passport or ID.
                  </p>
                  <div className="pax-block-list">
                    {passengers.map((p, index) => (
                      <PassengerForm
                        key={p.id}
                        passenger={p}
                        index={index}
                        isHolder={index === 0 && p.type === 'adult'}
                        errors={errors}
                        onChange={updatePassenger}
                      />
                    ))}
                  </div>
                </section>

                <section className="booking-card-step">
                  <h2 className="booking-card-step__title">Optional services</h2>
                  <p className="booking-card-step__hint">
                    Personalise your tour. These add-ons are optional and are added to the total.
                  </p>
                  <AddonsList
                    addons={addons}
                    selectedIds={selectedAddonIds}
                    onToggle={toggleAddon}
                  />
                </section>
              </>
            )}

            {step === 'contact' && (
              <section className="booking-card-step">
                <h2 className="booking-card-step__title">Contact details</h2>
                <p className="booking-card-step__hint">
                  We'll use these to confirm your booking and follow up on anything we need.
                </p>
                <ContactForm value={contact} onChange={setContact} errors={errors} />
              </section>
            )}

            <div className="booking-actions">
              <button type="button" className="button" onClick={goBack} disabled={submitting}>
                ← Back
              </button>
            </div>
          </div>

          <div className="booking-grid__sidebar">
            <BookingSummary
              tour={tour}
              date={draft.date}
              departure={draft.departure}
              counts={counts}
              lines={lines}
              total={total}
              ctaLabel={ctaLabel}
              onSubmit={onSubmit}
              submitLoading={submitLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
