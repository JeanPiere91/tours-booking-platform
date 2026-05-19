function splitTime(time) {
  if (!time) return { main: '', sub: '' };
  const match = time.match(/^(\d{1,2})(?::(\d{2}))?\s*([ap]m)?$/i);
  if (match) {
    const [, hh, mm, period] = match;
    const sub = period ? `:${mm || '00'} ${period.toLowerCase()}` : '';
    return { main: hh, sub };
  }
  return { main: time, sub: '' };
}

export default function Itinerary({ items }) {
  if (!items?.length) return null;

  return (
    <ol className="itinerary">
      {items.map((item, index) => {
        const { main, sub } = splitTime(item.time);
        return (
          <li className="itinerary__item" key={`${item.time}-${index}`}>
            <div className="itinerary__time" aria-label={item.time}>
              <span className="itinerary__time-main">{main}</span>
              {sub && <span className="itinerary__time-sub">{sub}</span>}
            </div>
            <div className="itinerary__content">
              <h3 className="itinerary__title">{item.title}</h3>
              {item.description && <p className="itinerary__desc">{item.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
