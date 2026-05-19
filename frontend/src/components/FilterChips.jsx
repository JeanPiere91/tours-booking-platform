export default function FilterChips({ categories, value, onChange }) {
  return (
    <div className="filter-chips" role="tablist" aria-label="Filter tours by category">
      {categories.map((category) => {
        const isActive = category === value;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`filter-chip${isActive ? ' filter-chip--active' : ''}`}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
