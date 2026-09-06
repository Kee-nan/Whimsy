const pool = require('../pool');

async function getAllForUser(userId) {
  const result = await pool.query(
    `SELECT le.status, le.logged_at, mi.id AS media_item_id, mi.media_type, mi.external_id,
            mi.title, mi.image_url
     FROM list_entries le
     JOIN media_items mi ON mi.id = le.media_item_id
     WHERE le.user_id = $1`,
    [userId]
  );
  return result.rows;
}

async function getEntry(userId, mediaItemId) {
  const result = await pool.query(
    `SELECT * FROM list_entries WHERE user_id = $1 AND media_item_id = $2`,
    [userId, mediaItemId]
  );
  return result.rows[0] || null;
}

async function upsertEntry(userId, mediaItemId, status, bumpLoggedAt = true) {
  const result = await pool.query(
    `INSERT INTO list_entries (user_id, media_item_id, status, logged_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (user_id, media_item_id)
     DO UPDATE SET status = EXCLUDED.status, updated_at = now(),
                    logged_at = CASE WHEN $4 THEN now() ELSE list_entries.logged_at END
     RETURNING *`,
    [userId, mediaItemId, status, bumpLoggedAt]
  );
  return result.rows[0];
}

async function updateLoggedAt(userId, mediaItemId, loggedAt) {
  const result = await pool.query(
    `UPDATE list_entries SET logged_at = $1 WHERE user_id = $2 AND media_item_id = $3 RETURNING *`,
    [loggedAt, userId, mediaItemId]
  );
  return result.rows[0] || null;
}

async function deleteEntry(userId, mediaItemId) {
  await pool.query(`DELETE FROM list_entries WHERE user_id = $1 AND media_item_id = $2`, [userId, mediaItemId]);
}

/**
 * Heavy, aggregate-rich version of a user's lists for the data-focused
 * table view: global/friend/external ratings, which friends have this
 * item and in what status (as JSON, for the avatar-stack UI), and
 * site-wide counts. Deliberately separate from getAllForUser since this
 * query is meaningfully more expensive and most callers don't need it.
 */
async function getAllForUserWithStats(userId) {
  const result = await pool.query(
    `WITH my_friends AS (
       SELECT CASE WHEN f.requester_id = $1 THEN f.addressee_id ELSE f.requester_id END AS friend_id
       FROM friendships f
       WHERE (f.requester_id = $1 OR f.addressee_id = $1) AND f.status = 'accepted'
     ),
     global_ratings AS (
       SELECT media_item_id, AVG(rating)::numeric(10,2) AS avg_rating, COUNT(*) AS rating_count
       FROM reviews GROUP BY media_item_id
     ),
     friend_ratings AS (
       SELECT r.media_item_id, AVG(r.rating)::numeric(10,2) AS avg_rating, COUNT(*) AS rating_count
       FROM reviews r JOIN my_friends mf ON mf.friend_id = r.user_id
       GROUP BY r.media_item_id
     ),
     friend_activity AS (
       SELECT le2.media_item_id,
              json_agg(json_build_object(
                'userId', u.id, 'username', u.username,
                'profilePicture', u.profile_picture_url, 'status', le2.status
              )) AS friends
       FROM list_entries le2
       JOIN my_friends mf ON mf.friend_id = le2.user_id
       JOIN users u ON u.id = le2.user_id
       GROUP BY le2.media_item_id
     ),
     site_counts AS (
       SELECT media_item_id,
              COUNT(*) FILTER (WHERE status = 'completed') AS completed_count,
              COUNT(*) FILTER (WHERE status = 'futures') AS watchlist_count,
              COUNT(*) FILTER (WHERE status = 'current') AS current_count
       FROM list_entries GROUP BY media_item_id
     ),
     review_counts AS (
       SELECT media_item_id, COUNT(*) FILTER (WHERE review_text IS NOT NULL AND review_text <> '') AS written_review_count
       FROM reviews GROUP BY media_item_id
     ),
     favorite_counts AS (
       SELECT media_item_id, COUNT(*) AS favorited_count FROM favorites GROUP BY media_item_id
     )
     SELECT le.status, le.logged_at,
            mi.id AS media_item_id, mi.media_type, mi.external_id, mi.title, mi.image_url,
            mi.external_rating, mi.external_rating_count,
            gr.avg_rating AS global_rating, gr.rating_count AS global_rating_count,
            fr.avg_rating AS friend_rating, fr.rating_count AS friend_rating_count,
            COALESCE(fa.friends, '[]'::json) AS friends_with_item,
            COALESCE(sc.completed_count, 0) AS site_completed_count,
            COALESCE(sc.watchlist_count, 0) AS site_watchlist_count,
            COALESCE(sc.current_count, 0) AS site_current_count,
            COALESCE(rc.written_review_count, 0) AS site_written_review_count,
            COALESCE(fvc.favorited_count, 0) AS site_favorited_count,
            ur.rating AS your_rating
     FROM list_entries le
     JOIN media_items mi ON mi.id = le.media_item_id
     LEFT JOIN global_ratings gr ON gr.media_item_id = mi.id
     LEFT JOIN friend_ratings fr ON fr.media_item_id = mi.id
     LEFT JOIN friend_activity fa ON fa.media_item_id = mi.id
     LEFT JOIN site_counts sc ON sc.media_item_id = mi.id
     LEFT JOIN review_counts rc ON rc.media_item_id = mi.id
     LEFT JOIN favorite_counts fvc ON fvc.media_item_id = mi.id
     LEFT JOIN reviews ur ON ur.media_item_id = mi.id AND ur.user_id = $1
     WHERE le.user_id = $1`,
    [userId]
  );
  return result.rows;
}

module.exports = { getAllForUser, getEntry, upsertEntry, updateLoggedAt, deleteEntry, getAllForUserWithStats };