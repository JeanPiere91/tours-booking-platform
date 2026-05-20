const request = require('supertest');

const app = require('../src/app');

describe('GET /health', () => {
  it('responds with 200 and the service identifier', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      service: 'tours-booking-backend',
    });
    expect(typeof res.body.uptime).toBe('number');
    expect(typeof res.body.timestamp).toBe('string');
    expect(new Date(res.body.timestamp).toString()).not.toBe('Invalid Date');
  });
});
