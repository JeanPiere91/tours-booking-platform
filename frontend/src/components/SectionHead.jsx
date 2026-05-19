export default function SectionHead({ eyebrow, title, accent }) {
  return (
    <header className="section-head">
      {eyebrow && <p className="section-head__eyebrow">{eyebrow}</p>}
      <h2 className="section-head__title">
        {title} {accent && <em>{accent}</em>}
      </h2>
    </header>
  );
}
