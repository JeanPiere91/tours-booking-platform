import { formatPriceUSD } from '../../utils/format.js';

function AddonCard({ addon, selected, onToggle }) {
  return (
    <button
      type="button"
      className={`addon${selected ? ' addon--selected' : ''}`}
      aria-pressed={selected}
      onClick={() => onToggle(addon.id)}
    >
      <span className="addon__icon" aria-hidden="true">
        {addon.icon}
      </span>
      <span className="addon__info">
        <span className="addon__name">{addon.name}</span>
        <span className="addon__desc">{addon.description}</span>
      </span>
      <span className="addon__price">+ {formatPriceUSD(addon.priceUSD)}</span>
    </button>
  );
}

export default function AddonsList({ addons, selectedIds, onToggle }) {
  if (!addons?.length) return null;
  return (
    <div className="addons-list" role="group" aria-label="Optional services">
      {addons.map((addon) => (
        <AddonCard
          key={addon.id}
          addon={addon}
          selected={selectedIds.includes(addon.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
