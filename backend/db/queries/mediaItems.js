const pool = require('../pool');

// Upsert: look up by (media_type, external_id), insert if missing, refresh cache if present.
async function upsertMediaItem({ mediaType, externalId, title, imageUrl, metadata = {} }) {
  const result = await pool.query(
    `INSERT INTO media_items (media_type, external_id, title, image_url, metadata)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (media_type, external_id)
     DO UPDATE SET title = EXCLUDED.title, image_url = EXCLUDED.image_url,
                    metadata = EXCLUDED.metadata, cached_at = now()
     RETURNING *`,
    [mediaType, externalId, title, imageUrl, JSON.stringify(metadata)]
  );
  return result.rows[0];
}

async function findByTypeAndExternalId(mediaType, externalId) {
  const result = await pool.query(
    `SELECT * FROM media_items WHERE media_type = $1 AND external_id = $2`,
    [mediaType, externalId]
  );
  return result.rows[0] || null;
}

module.exports = { upsertMediaItem, findByTypeAndExternalId };