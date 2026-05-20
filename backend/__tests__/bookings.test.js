// Mock the email service BEFORE requiring the app so the Resend SDK is never
// instantiated in the test process. jest hoists this above the requires below.
jest.mock('../src/services/emailService', () => ({
  sendBookingConfirmation: jest.fn().mockResolvedValue({ sent: true, id: 'mock-email-id' }),
  isEnabled: jest.fn().mockReturnValue(true),
}));

const request = require('supertest');

const app = require('../src/app');
const emailService = require('../src/services/emailService');

function validPayload(overrides = {}) {
  return {
    tourSlug: 'machu-picchu-full-day',
    date: '2026-06-15',
    departure: 'Morning · 04:30 am',
    passengers: [
      {
        type: 'adult',
        firstName: 'Maria',
        lastName: 'Quispe',
        documentType: 'passport',
        documentNumber: 'A1234567',
        nationality: 'Mexico',
      },
      {
        type: 'adult',
        firstName: 'Carlos',
        lastName: 'Quispe',
        documentType: 'passport',
        documentNumber: 'B7654321',
        nationality: 'Mexico',
      },
      {
        type: 'child',
        firstName: 'Sofia',
        lastName: 'Quispe',
        documentType: 'passport',
        documentNumber: 'C111',
        dateOfBirth: '2017-08-12',
      },
    ],
    addonIds: ['window-seat', 'private-guide'],
    contact: {
      email: 'maria@example.com',
      phone: '+52 55 1234 5678',
      acceptTerms: true,
    },
    ...overrides,
  };
}

describe('POST /api/bookings — valid data', () => {
  it('creates a booking, returns 201, and a code in the IPA-YYYY-XXXXXX format', async () => {
    const res = await request(app).post('/api/bookings').send(validPayload());

    expect(res.status).toBe(201);
    expect(res.body.code).toMatch(/^IPA-\d{4}-[A-Z2-9]{6}$/);
    expect(res.body.status).toBe('pending');
    expect(res.body.tour.slug).toBe('machu-picchu-full-day');
    expect(res.body.passengers).toEqual({ adults: 2, children: 1, infants: 0 });
  });

  it('calculates the same total the mockup expects (USD 1,075)', async () => {
    const res = await request(app).post('/api/bookings').send(validPayload());

    expect(res.status).toBe(201);
    expect(res.body.totals).toMatchObject({
      tourSubtotal: 950,   // 2 × 380 + 1 × 190
      addonsSubtotal: 125, // window-seat × 3 paying pax + private-guide × 1
      total: 1075,
      currency: 'USD',
    });
  });

  it('invokes the Resend mock exactly once per successful booking', async () => {
    await request(app).post('/api/bookings').send(validPayload());

    expect(emailService.sendBookingConfirmation).toHaveBeenCalledTimes(1);
    const [bookingArg] = emailService.sendBookingConfirmation.mock.calls[0];
    expect(bookingArg.code).toMatch(/^IPA-/);
    expect(bookingArg.contact.email).toBe('maria@example.com');
  });

  it('persists the booking so GET /api/bookings/:code returns it', async () => {
    const create = await request(app).post('/api/bookings').send(validPayload());
    const { code } = create.body;

    const fetched = await request(app).get(`/api/bookings/${code}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.code).toBe(code);
    expect(fetched.body.tour.title).toBe('Machu Picchu Full Day');
  });
});

describe('POST /api/bookings — invalid data', () => {
  it('returns 400 with structured details for an empty body', async () => {
    const res = await request(app).post('/api/bookings').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid/i);
    expect(Array.isArray(res.body.details)).toBe(true);
    expect(res.body.details.length).toBeGreaterThan(0);
    res.body.details.forEach((detail) => {
      expect(detail).toEqual(
        expect.objectContaining({
          path: expect.any(String),
          message: expect.any(String),
        }),
      );
    });
  });

  it('rejects bookings with no adults', async () => {
    const payload = validPayload({
      passengers: [
        {
          type: 'child',
          firstName: 'Sofia',
          lastName: 'Quispe',
          documentType: 'passport',
          documentNumber: 'C111',
          dateOfBirth: '2017-08-12',
        },
      ],
    });

    const res = await request(app).post('/api/bookings').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.details.some((d) => /adult/i.test(d.message))).toBe(true);
  });

  it('rejects an invalid email', async () => {
    const payload = validPayload();
    payload.contact.email = 'not-an-email';

    const res = await request(app).post('/api/bookings').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'contact.email' }),
      ]),
    );
  });

  it('rejects when the terms checkbox is not accepted', async () => {
    const payload = validPayload();
    payload.contact.acceptTerms = false;

    const res = await request(app).post('/api/bookings').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'contact.acceptTerms' }),
      ]),
    );
  });

  it('rejects child passengers without date of birth', async () => {
    const payload = validPayload();
    delete payload.passengers[2].dateOfBirth;

    const res = await request(app).post('/api/bookings').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'passengers[2].dateOfBirth' }),
      ]),
    );
  });

  it('returns 404 when the tour slug does not exist', async () => {
    const payload = validPayload({ tourSlug: 'no-such-tour' });

    const res = await request(app).post('/api/bookings').send(payload);

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it('never calls the email service for invalid requests', async () => {
    emailService.sendBookingConfirmation.mockClear();

    await request(app).post('/api/bookings').send({});

    expect(emailService.sendBookingConfirmation).not.toHaveBeenCalled();
  });
});

describe('GET /api/bookings/:code', () => {
  it('returns 404 for an unknown code', async () => {
    const res = await request(app).get('/api/bookings/IPA-2026-NOPE99');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});
