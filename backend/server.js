const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const accountRoutes = require('./routes/accountRoutes');
const listRoutes = require('./routes/listRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const searchRoutes = require('./routes/searchRoutes');
const friendRoutes = require('./routes/friendRoutes');
const pool = require('./db/pool');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Verify Postgres connection on startup instead of Mongoose's .connect()
pool.query('SELECT NOW()')
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL:', err));

app.use(cors());
app.use(express.json());

app.use('/api/accounts', accountRoutes);
app.use('/api/list', listRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/friends', friendRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

