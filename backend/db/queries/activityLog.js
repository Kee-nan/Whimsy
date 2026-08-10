const pool = require('../pool');

async function logActivity(userId, actionType, mediaItemId, detail = {}) {
  await pool.query(
    `INSERT INTO activity_log (user_id, action_type, media_item_id, detail)
     VALUES ($1, $2, $3, $4)`,
    [userId, actionType, mediaItemId, JSON.stringify(detail)]
  );
}

async function getRecentForUser(userId, limit = 5) {
  const result = await pool.query(
    `SELECT al.action_type, al.detail, al.created_at,
            mi.media_type, mi.external_id, mi.title, mi.image_url
     FROM activity_log al
     LEFT JOIN media_items mi ON mi.id = al.media_item_id
     WHERE al.user_id = $1
     ORDER BY al.created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

/** All accepted friends' recent activity, most recent first — feeds the recommendations page. */
async function getRecentForFriends(userId, limit = 30) {
  const result = await pool.query(
    `SELECT al.action_type, al.detail, al.created_at,
            u.id AS user_id, u.username, u.profile_picture_url,
            mi.media_type, mi.external_id, mi.title, mi.image_url
     FROM activity_log al
     JOIN users u ON u.id = al.user_id
     JOIN friendships f
       ON (f.requester_id = $1 AND f.addressee_id = u.id)
       OR (f.addressee_id = $1 AND f.requester_id = u.id)
     LEFT JOIN media_items mi ON mi.id = al.media_item_id
     WHERE f.status = 'accepted'
     ORDER BY al.created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

/**
 * "Friends also logged" recommendations (Tier 1): the most recent
 * distinct media items your accepted friends have added/reviewed that
 * you do NOT already have on any of your own lists.
 */
async function getFriendRecommendations(userId, limit = 20) {
  const result = await pool.query(
    `SELECT * FROM (
       SELECT DISTINCT ON (mi.id)
              mi.id AS media_item_id, mi.media_type, mi.external_id,
              mi.title, mi.image_url, u.username, al.created_at
       FROM activity_log al
       JOIN users u ON u.id = al.user_id
       JOIN friendships f
         ON (f.requester_id = $1 AND f.addressee_id = u.id)
         OR (f.addressee_id = $1 AND f.requester_id = u.id)
       JOIN media_items mi ON mi.id = al.media_item_id
       WHERE f.status = 'accepted'
         AND al.action_type IN ('list_add', 'review_add')
         AND mi.id NOT IN (SELECT media_item_id FROM list_entries WHERE user_id = $1)
       ORDER BY mi.id, al.created_at DESC
     ) sub
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

module.exports = { logActivity, getRecentForUser, getRecentForFriends, getFriendRecommendations };