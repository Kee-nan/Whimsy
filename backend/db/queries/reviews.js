const pool = require('../pool');

async function getAllForUser(userId) {
  const result = await pool.query(
    `SELECT r.*, mi.media_type, mi.external_id, mi.title, mi.image_url
     FROM reviews r
     JOIN media_items mi ON mi.id = r.media_item_id
     WHERE r.user_id = $1`,
    [userId]
  );
  return result.rows;
}

async function getOne(userId, mediaItemId) {
  const result = await pool.query(
    `SELECT * FROM reviews WHERE user_id = $1 AND media_item_id = $2`,
    [userId, mediaItemId]
  );
  return result.rows[0] || null;
}

async function upsertReview(userId, mediaItemId, rating, reviewText) {
  const result = await pool.query(
    `INSERT INTO reviews (user_id, media_item_id, rating, review_text)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, media_item_id)
     DO UPDATE SET rating = EXCLUDED.rating, review_text = EXCLUDED.review_text, updated_at = now()
     RETURNING *`,
    [userId, mediaItemId, rating, reviewText]
  );
  return result.rows[0];
}

async function deleteReview(userId, mediaItemId) {
  const result = await pool.query(
    `DELETE FROM reviews WHERE user_id = $1 AND media_item_id = $2 RETURNING id`,
    [userId, mediaItemId]
  );
  return result.rowCount > 0;
}

module.exports = { getAllForUser, getOne, upsertReview, deleteReview };