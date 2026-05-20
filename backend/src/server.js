require('dotenv').config();

const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`[backend] API listening on http://localhost:${config.port}`);
  if (!config.resend.apiKey) {
    console.warn(
      '[backend] RESEND_API_KEY not set — booking emails will be skipped. See backend/.env.example.',
    );
  }
});
