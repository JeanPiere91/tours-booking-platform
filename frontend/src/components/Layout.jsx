import { Link, NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container app-header__inner">
          <Link to="/tours" className="brand" aria-label="Wander home">
            <span className="brand__mark" aria-hidden="true">◭</span>
            <span className="brand__name">Wander</span>
          </Link>
          <nav className="primary-nav" aria-label="Primary">
            <NavLink to="/tours" className="primary-nav__link">
              Tours
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="container app-footer__inner">
          <p>&copy; {new Date().getFullYear()} Wander Tours · Sprint 1 demo build</p>
        </div>
      </footer>
    </div>
  );
}
