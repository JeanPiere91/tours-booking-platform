const request = require('supertest');

const app = require('../src/app');

describe('GET /api/tours', () => {
  it('returns the full catalogue', async () => {
    const res = await request(app).get('/api/tours');

    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.category).toBeNull();

    const tour = res.body.items[0];
    expect(tour).toEqual(
      expect.objectContaining({
        slug: expect.any(String),
        title: expect.any(String),
        priceUSD: expect.any(Number),
        categories: expect.any(Array),
      }),
    );
  });

  it('filters by a single category', async () => {
    const res = await request(app).get('/api/tours').query({ category: 'Sacred Valley' });

    expect(res.status).toBe(200);
    expect(res.body.category).toBe('Sacred Valley');
    expect(res.body.items.length).toBeGreaterThan(0);
    res.body.items.forEach((tour) => {
      expect(tour.categories).toContain('Sacred Valley');
    });
  });

  it('treats "All" the same as no filter', async () => {
    const all = await request(app).get('/api/tours');
    const filtered = await request(app).get('/api/tours').query({ category: 'All' });

    expect(filtered.status).toBe(200);
    expect(filtered.body.count).toBe(all.body.count);
  });
});

describe('GET /api/tours/:slug', () => {
  it('returns a tour by its slug with its itinerary', async () => {
    const res = await request(app).get('/api/tours/machu-picchu-full-day');

    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('machu-picchu-full-day');
    expect(res.body.title).toBe('Machu Picchu Full Day');
    expect(res.body.priceUSD).toBe(380);
    expect(Array.isArray(res.body.itinerary)).toBe(true);
    expect(res.body.itinerary.length).toBeGreaterThan(0);
    expect(res.body.itinerary[0]).toEqual(
      expect.objectContaining({
        time: expect.any(String),
        title: expect.any(String),
      }),
    );
  });

  it('returns 404 for an unknown slug', async () => {
    const res = await request(app).get('/api/tours/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
    expect(res.body.slug).toBe('does-not-exist');
  });
});
