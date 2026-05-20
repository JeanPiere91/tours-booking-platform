module.exports = {
  port: Number(process.env.PORT) || 5000,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    agencyEmail: process.env.AGENCY_EMAIL || '',
  },
};
