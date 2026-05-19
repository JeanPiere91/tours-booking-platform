import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/tours', label: 'Tours', internal: true },
  { to: '#destinations', label: 'Destinations' },
  { to: '#about', label: 'About us' },
  { to: '#my-booking', label: 'My booking' },
];

const WHATSAPP_URL = 'https://wa.me/51999999999';

export default function SiteHeader() {
  return (
    <header className="ipa-header">
      <div className="ipa-header__inner">
        <NavLink to="/tours" className="logo" aria-label="Inka Planet Adventure — home">
          <span className="logo-mark" aria-hidden="true">IPA</span>
          <span className="logo-text">
            Inka Planet
            <small>Adventure</small>
          </span>
        </NavLink>

        <nav className="nav-main" aria-label="Main navigation">
          {NAV_LINKS.map((link) =>
            link.internal ? (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) => (isActive ? 'nav-main__link active' : 'nav-main__link')}
              >
                {link.label}
              </NavLink>
            ) : (
              <a key={link.label} href={link.to} className="nav-main__link">
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="nav-actions">
          <button type="button" className="lang" aria-label="Change language">
            EN <span aria-hidden="true">▾</span>
          </button>
          <a className="btn-wa" href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener">
            <span className="btn-wa__dot" aria-hidden="true">●</span>
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
