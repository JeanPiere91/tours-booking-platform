const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const config = require('./config');
const healthRouter = require('./routes/health');
const toursRouter = require('./routes/tours');

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/health', healthRouter);
app.use('/api/tours', toursRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('[backend] unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
