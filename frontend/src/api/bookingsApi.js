const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, init = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json() : null;
  if (!response.ok) {
    const error = new Error(body?.error || `Request failed (${response.status}) for ${path}`);
    error.status = response.status;
    error.details = body?.details;
    throw error;
  }
  return body;
}

export function fetchAddons() {
  return request('/api/addons');
}

export function createBooking(payload) {
  return request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchBookingByCode(code) {
  return request(`/api/bookings/${encodeURIComponent(code)}`);
}
