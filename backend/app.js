require('dotenv').config();
require('./config/env')();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');

const accountRoutes = require('./routes/accountRoutes');
const listRoutes = require('./routes/listRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const searchRoutes = require('./routes/searchRoutes');
const friendRoutes = require('./routes/friendRoutes');
const customListRoutes = require('./routes/customListRoutes');
const activityRoutes = require('./routes/activityRoutes');
const globalRoutes = require('./routes/globalRoutes');
const errorHandler = require('./middleware/errorHandler');
const pool = require('./db/pool');

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:3000'];

const app = express();

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: false,
}));

const searchLimiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use('/api/search', searchLimiter);

app.use('/api/accounts', accountRoutes);
app.use('/api/list', listRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/custom-lists', customListRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/global', globalRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'db unreachable' });
  }
});

app.use(errorHandler); // must stay last

module.exports = app;