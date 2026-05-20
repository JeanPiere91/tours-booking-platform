import SearchBox from './SearchBox.jsx';

export default function Hero({ onSearch }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <p className="hero__eyebrow">Travel agency · Cusco, Peru</p>
        <h1 id="hero-title" className="hero__title">
          Experience <em>authentic</em> Peru,
          <br />
          from Cusco to Machu Picchu
        </h1>
        <p className="hero__lede">
          Over 1,000 happy travelers. Local guides, small groups, and personalized care before,
          during, and after your trip Test.
        </p>
        <SearchBox onSearch={onSearch} />
      </div>
    </section>
  );
}
