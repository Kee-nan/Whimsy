const pool = require('../pool');

async function createList(userId, name, description, isPublic) {
  const result = await pool.query(
    `INSERT INTO custom_lists (user_id, name, description, is_public)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, name, description, isPublic]
  );
  return result.rows[0];
}

async function getAllForUser(userId) {
  const result = await pool.query(
    `SELECT cl.*, COUNT(cli.id) AS item_count
     FROM custom_lists cl
     LEFT JOIN custom_list_items cli ON cli.custom_list_id = cl.id
     WHERE cl.user_id = $1
     GROUP BY cl.id
     ORDER BY cl.updated_at DESC`,
    [userId]
  );
  return result.rows;
}

async function getById(listId) {
  const result = await pool.query(`SELECT * FROM custom_lists WHERE id = $1`, [listId]);
  return result.rows[0] || null;
}

async function getItems(listId) {
  const result = await pool.query(
    `SELECT cli.note, cli.position, cli.added_at,
            mi.id AS media_item_id, mi.media_type, mi.external_id, mi.title, mi.image_url
     FROM custom_list_items cli
     JOIN media_items mi ON mi.id = cli.media_item_id
     WHERE cli.custom_list_id = $1
     ORDER BY cli.position ASC, cli.added_at ASC`,
    [listId]
  );
  return result.rows;
}

async function addItem(listId, mediaItemId, note = null) {
  const posResult = await pool.query(
    `SELECT COALESCE(MAX(position), -1) + 1 AS next_pos FROM custom_list_items WHERE custom_list_id = $1`,
    [listId]
  );
  const result = await pool.query(
    `INSERT INTO custom_list_items (custom_list_id, media_item_id, note, position)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (custom_list_id, media_item_id) DO NOTHING
     RETURNING *`,
    [listId, mediaItemId, note, posResult.rows[0].next_pos]
  );
  return result.rows[0] || null;
}

async function removeItem(listId, mediaItemId) {
  await pool.query(
    `DELETE FROM custom_list_items WHERE custom_list_id = $1 AND media_item_id = $2`,
    [listId, mediaItemId]
  );
}

async function updateList(listId, { name, description, isPublic }) {
  const result = await pool.query(
    `UPDATE custom_lists SET name = $1, description = $2, is_public = $3, updated_at = now()
     WHERE id = $4 RETURNING *`,
    [name, description, isPublic, listId]
  );
  return result.rows[0];
}

async function deleteList(listId) {
  await pool.query(`DELETE FROM custom_lists WHERE id = $1`, [listId]);
}

module.exports = {
  createList, getAllForUser, getById, getItems,
  addItem, removeItem, updateList, deleteList,
};