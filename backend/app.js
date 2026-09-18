require('dotenv').config();
require('./config/env')();


const express = require('express');
const cors = require('cors');



const accountRoutes = require('./routes/accountRoutes');
const listRoutes = require('./routes/listRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const searchRoutes = require('./routes/searchRoutes');
const friendRoutes = require('./routes/friendRoutes');
const customListRoutes = require('./routes/customListRoutes');
const activityRoutes = require('./routes/activityRoutes');
const globalRoutes = require('./routes/globalRoutes');

const app = express();

const helmet = require('helmet');

const morgan = require('morgan');

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:3000']; // default covers local dev automatically

app.use(cors({
  origin: (origin, callback) => {
    // `origin` is undefined for same-origin/non-browser requests (e.g. curl,
    // server-to-server) — always allow those through.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // was blocking frontend from reading API responses across ports
  crossOriginOpenerPolicy: false,                         // not needed for a plain REST API, and adds no value here
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api/accounts', accountRoutes);
app.use('/api/list', listRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/custom-lists', customListRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/global', globalRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler); // MUST be last

module.exports = app;