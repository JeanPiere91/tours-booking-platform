export default function ContentBlock({ title, children }) {
  return (
    <section className="content-block">
      {title && <h2 className="content-block__title">{title}</h2>}
      {children}
    </section>
  );
}
