const path = require('path');
const dotenvResult = require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env.test') });
const { Pool } = require('pg');

module.exports = async () => {
  if (dotenvResult.error) {
    throw new Error(
      `Could not find or load backend/.env.test — confirm the file exists there ` +
      `(on Windows, double-check it isn't actually named ".env.test.txt"). ` +
      `Original error: ${dotenvResult.error.message}`
    );
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set after loading .env.test — check the file\'s contents.');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(`
      TRUNCATE TABLE
        review_likes, activity_log, custom_list_items, custom_lists,
        friendships, reviews, favorites, list_entries, media_items, users
      RESTART IDENTITY CASCADE;
    `);
  } finally {
    await pool.end();
  }
};