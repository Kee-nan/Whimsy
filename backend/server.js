require('dotenv').config();
require('./config/env')();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const accountRoutes = require('./routes/accountRoutes');
const listRoutes = require('./routes/listRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const searchRoutes = require('./routes/searchRoutes');
const friendRoutes = require('./routes/friendRoutes');
const pool = require('./db/pool');
const errorHandler = require('./middleware/errorHandler');

const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Verify Postgres connection on startup instead of Mongoose's .connect()
pool.query('SELECT NOW()')
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL:', err));

app.use(cors());
app.use(express.json());

app.use(helmet());
app.use(morgan('dev')); // request logging — genuinely useful during local debugging too


// Applies specifically to the search routes, since those're the ones proxying
// rate-limited third-party APIs (Jikan in particular is aggressive about this)
const searchLimiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use('/api/search', searchLimiter);

app.use('/api/accounts', accountRoutes);
app.use('/api/list', listRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/friends', friendRoutes);
app.use(errorHandler);

// in server.js, near the other routes
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'db unreachable' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

