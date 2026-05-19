function ItemList({ items, variant }) {
  if (!items?.length) return null;
  const symbol = variant === 'cross' ? '✕' : '✓';
  return (
    <ul className={`includes-list includes-list--${variant}`}>
      {items.map((item) => (
        <li key={item} className="includes-list__item">
          <span className={`includes-list__icon includes-list__icon--${variant}`} aria-hidden="true">
            {symbol}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function IncludesList({ includes = [], excludes = [] }) {
  if (!includes.length && !excludes.length) return null;
  return (
    <div className="includes-grid">
      <div>
        <h3 className="includes-grid__heading">Included</h3>
        <ItemList items={includes} variant="check" />
      </div>
      <div>
        <h3 className="includes-grid__heading">Not included</h3>
        <ItemList items={excludes} variant="cross" />
      </div>
    </div>
  );
}
