const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    const message = `Request failed (${response.status}) for ${path}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export function fetchTours({ category } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  const query = params.toString();
  return request(`/api/tours${query ? `?${query}` : ''}`);
}

export function fetchTourBySlug(slug) {
  return request(`/api/tours/${encodeURIComponent(slug)}`);
}
