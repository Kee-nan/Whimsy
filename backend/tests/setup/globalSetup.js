require('dotenv').config({ path: '.env.test' });
const { Pool } = require('pg');

module.exports = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query(`
    TRUNCATE TABLE friendships, reviews, favorites, list_entries, media_items, users
    RESTART IDENTITY CASCADE;
  `);
  await pool.end();
};