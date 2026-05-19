export default function PassengerCounter({
  category,
  subtitle,
  value,
  onChange,
  min = 0,
  max = 9,
}) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div className="pax-row">
      <div className="pax-row__info">
        <p className="pax-row__cat">{category}</p>
        {subtitle && <p className="pax-row__sub">{subtitle}</p>}
      </div>
      <div className="pax-counter" role="group" aria-label={`${category} passengers`}>
        <button
          type="button"
          className="pax-counter__btn"
          onClick={decrement}
          disabled={value <= min}
          aria-label={`Remove one ${category}`}
        >
          −
        </button>
        <span className="pax-counter__qty" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          className="pax-counter__btn"
          onClick={increment}
          disabled={value >= max}
          aria-label={`Add one ${category}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
