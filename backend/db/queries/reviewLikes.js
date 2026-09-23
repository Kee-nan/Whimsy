// backend/db/queries/reviewLikes.js
const pool = require('../pool');

async function toggleLike(reviewId, userId) {
  const existing = await pool.query(
    `SELECT id FROM review_likes WHERE review_id = $1 AND user_id = $2`,
    [reviewId, userId]
  );
  if (existing.rows.length > 0) {
    await pool.query(`DELETE FROM review_likes WHERE id = $1`, [existing.rows[0].id]);
    return { liked: false };
  }
  await pool.query(`INSERT INTO review_likes (review_id, user_id) VALUES ($1, $2)`, [reviewId, userId]);
  return { liked: true };
}

module.exports = { toggleLike };