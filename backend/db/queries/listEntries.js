const pool = require('../pool');

async function getAllForUser(userId) {
  const result = await pool.query(
    `SELECT le.status, mi.id AS media_item_id, mi.media_type, mi.external_id,
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

async function upsertEntry(userId, mediaItemId, status) {
  const result = await pool.query(
    `INSERT INTO list_entries (user_id, media_item_id, status)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, media_item_id)
     DO UPDATE SET status = EXCLUDED.status, updated_at = now()
     RETURNING *`,
    [userId, mediaItemId, status]
  );
  return result.rows[0];
}

async function deleteEntry(userId, mediaItemId) {
  await pool.query(
    `DELETE FROM list_entries WHERE user_id = $1 AND media_item_id = $2`,
    [userId, mediaItemId]
  );
}

module.exports = { getAllForUser, upsertEntry, deleteEntry, getEntry };