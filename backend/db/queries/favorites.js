const pool = require('../pool');

async function getForUser(userId) {
  const result = await pool.query(
    `SELECT f.slot_index, mi.id AS media_item_id, mi.media_type, mi.external_id,
            mi.title, mi.image_url
     FROM favorites f
     JOIN media_items mi ON mi.id = f.media_item_id
     WHERE f.user_id = $1
     ORDER BY f.slot_index`,
    [userId]
  );
  return result.rows;
}

// Replace all favorites in one transaction (matches current PATCH /favorites behavior
// of replacing the whole array).
async function replaceAll(userId, slots) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM favorites WHERE user_id = $1`, [userId]);
    for (let i = 0; i < slots.length; i++) {
      if (slots[i] !== null) {
        await client.query(
          `INSERT INTO favorites (user_id, media_item_id, slot_index) VALUES ($1, $2, $3)`,
          [userId, slots[i], i]
        );
      }
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { getForUser, replaceAll };