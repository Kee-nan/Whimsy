const pool = require('../pool');

/** Average + count of every review ever left for this media item, platform-wide. */
async function getGlobalRating(mediaItemId) {
  const result = await pool.query(
    `SELECT AVG(rating)::numeric(10,2) AS average, COUNT(*) AS count
     FROM reviews WHERE media_item_id = $1`,
    [mediaItemId]
  );
  const row = result.rows[0];
  return { average: row.average ? parseFloat(row.average) : null, count: parseInt(row.count, 10) };
}

/** Average + count of reviews left by users who are accepted friends of userId. */
async function getFriendRating(mediaItemId, userId) {
  const result = await pool.query(
    `SELECT AVG(r.rating)::numeric(10,2) AS average, COUNT(*) AS count
     FROM reviews r
     JOIN friendships f
       ON (f.requester_id = $2 AND f.addressee_id = r.user_id)
       OR (f.addressee_id = $2 AND f.requester_id = r.user_id)
     WHERE r.media_item_id = $1 AND f.status = 'accepted'`,
    [mediaItemId, userId]
  );
  const row = result.rows[0];
  return { average: row.average ? parseFloat(row.average) : null, count: parseInt(row.count, 10) };
}

/**
 * Every accepted friend of userId who has this media item on a list
 * and/or has reviewed it. Left-joins list_entries and reviews so a
 * friend shows up even if they only listed it without reviewing, or
 * only reviewed it without a current list status.
 */
async function getFriendActivity(mediaItemId, userId) {
  const result = await pool.query(
    `SELECT u.id AS user_id, u.username,
            le.status AS list_status,
            r.rating, r.review_text
     FROM users u
     JOIN friendships f
       ON (f.requester_id = $2 AND f.addressee_id = u.id)
       OR (f.addressee_id = $2 AND f.requester_id = u.id)
     LEFT JOIN list_entries le ON le.user_id = u.id AND le.media_item_id = $1
     LEFT JOIN reviews r ON r.user_id = u.id AND r.media_item_id = $1
     WHERE f.status = 'accepted'
       AND (le.id IS NOT NULL OR r.id IS NOT NULL)
     ORDER BY u.username`,
    [mediaItemId, userId]
  );
  return result.rows;
}

module.exports = { getGlobalRating, getFriendRating, getFriendActivity };