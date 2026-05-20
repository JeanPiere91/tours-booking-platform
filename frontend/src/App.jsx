import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ToursListPage from './pages/ToursListPage.jsx';
import TourDetailPage from './pages/TourDetailPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import BookingConfirmationPage from './pages/BookingConfirmationPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/tours" replace />} />
        <Route path="/tours" element={<ToursListPage />} />
        <Route path="/tours/:slug" element={<TourDetailPage />} />
        <Route path="/booking/:slug" element={<BookingPage />} />
        <Route path="/bookings/:code" element={<BookingConfirmationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
