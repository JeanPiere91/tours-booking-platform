import { Outlet } from 'react-router-dom';

import SiteHeader from './SiteHeader.jsx';

export default function Layout() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <div className="app-footer__inner">
          <span className="app-footer__brand">
            <span className="logo-mark logo-mark--sm" aria-hidden="true">IPA</span>
            Inka Planet Adventure
          </span>
          <span className="app-footer__copy">
            &copy; {new Date().getFullYear()} · Cusco, Peru · Sprint 1 demo
          </span>
        </div>
      </footer>
    </div>
  );
}
