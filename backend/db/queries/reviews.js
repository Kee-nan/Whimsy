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

/**
 * All reviews for a given media item, globally, paginated, sorted by
 * like count descending (most-liked first) then most-recent as a
 * tiebreaker. Includes each review's like count and whether the
 * requesting user has liked it, plus the reviewer's username/avatar.
 */
async function getPaginatedForMedia(mediaItemId, requestingUserId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [rowsResult, countResult] = await Promise.all([
    pool.query(
      `SELECT r.id, r.rating, r.review_text, r.created_at,
              u.id AS user_id, u.username, u.profile_picture_url,
              COUNT(rl.id) AS like_count,
              BOOL_OR(rl.user_id = $2) AS liked_by_me
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       LEFT JOIN review_likes rl ON rl.review_id = r.id
       WHERE r.media_item_id = $1
       GROUP BY r.id, u.id
       ORDER BY like_count DESC, r.created_at DESC
       LIMIT $3 OFFSET $4`,
      [mediaItemId, requestingUserId, limit, offset]
    ),
    pool.query(`SELECT COUNT(*) AS total FROM reviews WHERE media_item_id = $1`, [mediaItemId]),
  ]);

  return {
    reviews: rowsResult.rows.map(r => ({
      id: r.id,
      rating: r.rating,
      reviewText: r.review_text,
      createdAt: r.created_at,
      username: r.username,
      profilePicture: r.profile_picture_url,
      likeCount: parseInt(r.like_count, 10),
      likedByMe: r.liked_by_me,
    })),
    page,
    totalPages: Math.ceil(parseInt(countResult.rows[0].total, 10) / limit),
    totalCount: parseInt(countResult.rows[0].total, 10),
  };
}

async function getRatingDistribution(userId) {
  const result = await pool.query(
    `SELECT rating, COUNT(*) AS count FROM reviews WHERE user_id = $1 GROUP BY rating`,
    [userId]
  );
  return result.rows;
}

module.exports = { getAllForUser, getOne, upsertReview, deleteReview, getPaginatedForMedia, getRatingDistribution};