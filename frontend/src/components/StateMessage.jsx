export default function StateMessage({ title, description, action }) {
  return (
    <div className="state-message" role="status">
      <h2 className="state-message__title">{title}</h2>
      {description && <p className="state-message__description">{description}</p>}
      {action && <div className="state-message__action">{action}</div>}
    </div>
  );
}
