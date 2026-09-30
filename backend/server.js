const app = require('./app');
const pool = require('./db/pool');

const PORT = process.env.PORT || 5000;

pool.query('SELECT NOW()')
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL:', err));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));