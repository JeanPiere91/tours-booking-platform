export default function TourCardSkeleton() {
  return (
    <div className="tour-card tour-card--skeleton" aria-hidden="true">
      <div className="tour-img skeleton" />
      <div className="tour-body">
        <div className="skeleton skeleton--line skeleton--eyebrow" />
        <div className="skeleton skeleton--line skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--short" />
        <div className="skeleton skeleton--line skeleton--foot" />
      </div>
    </div>
  );
}
