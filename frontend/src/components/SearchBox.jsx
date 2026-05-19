const FIELDS = [
  { label: 'Destination', value: 'Cusco — Machu Picchu' },
  { label: 'Duration', value: '1 day' },
  { label: 'Date', value: 'Jun 15 · 2026' },
];

export default function SearchBox({ onSearch }) {
  return (
    <div className="search-box" role="search">
      {FIELDS.map((field) => (
        <button
          key={field.label}
          type="button"
          className="search-field"
          aria-label={`${field.label}: ${field.value}`}
        >
          <span className="search-field__label">{field.label}</span>
          <span className="search-field__value">{field.value}</span>
        </button>
      ))}
      <button type="button" className="search-btn" onClick={onSearch}>
        Search tours <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
