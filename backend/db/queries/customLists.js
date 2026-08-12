const pool = require('../pool');

async function createList(userId, name, description, isRanked, visibility) {
  const result = await pool.query(
    `INSERT INTO custom_lists (user_id, name, description, is_ranked, visibility)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, name, description, isRanked, visibility]
  );
  return result.rows[0];
}

/**
 * Includes a cover_image (the first item's poster/cover, by position) so
 * the "My Lists" grid can show a visual thumbnail per list instead of a
 * blank card.
 */
async function getAllForUser(userId) {
  const result = await pool.query(
    `SELECT cl.*, COUNT(cli.id) AS item_count,
            (SELECT mi.image_url FROM custom_list_items cli2
             JOIN media_items mi ON mi.id = cli2.media_item_id
             WHERE cli2.custom_list_id = cl.id
             ORDER BY cli2.position ASC LIMIT 1) AS cover_image
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

/** Persists a new item order after a drag-and-drop reorder in edit mode. */
async function reorderItems(listId, orderedMediaItemIds) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < orderedMediaItemIds.length; i++) {
      await client.query(
        `UPDATE custom_list_items SET position = $1 WHERE custom_list_id = $2 AND media_item_id = $3`,
        [i, listId, orderedMediaItemIds[i]]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateList(listId, { name, description, isRanked, visibility }) {
  const result = await pool.query(
    `UPDATE custom_lists SET name = $1, description = $2, is_ranked = $3, visibility = $4, updated_at = now()
     WHERE id = $5 RETURNING *`,
    [name, description, isRanked, visibility, listId]
  );
  return result.rows[0];
}

async function deleteList(listId) {
  await pool.query(`DELETE FROM custom_lists WHERE id = $1`, [listId]);
}

/** Powers the checkbox dropdown: which of my lists already have this item. */
async function getListsWithMembership(userId, mediaItemId) {
  const result = await pool.query(
    `SELECT cl.id, cl.name,
            EXISTS(
              SELECT 1 FROM custom_list_items cli
              WHERE cli.custom_list_id = cl.id AND cli.media_item_id = $2
            ) AS included
     FROM custom_lists cl
     WHERE cl.user_id = $1
     ORDER BY cl.name`,
    [userId, mediaItemId]
  );
  return result.rows;
}

module.exports = {
  createList, getAllForUser, getById, getItems,
  addItem, removeItem, reorderItems, updateList, deleteList,
  getListsWithMembership,
};