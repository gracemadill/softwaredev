const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.allowedOrigins.includes('*') || config.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
  })
);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/documents', documentRoutes);
app.use('/ai', aiRoutes);

app.use((err, _req, res, _next) => {
  if (err?.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  return res.status(500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
