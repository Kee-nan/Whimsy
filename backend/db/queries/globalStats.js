const pool = require('../pool');

async function getGlobalTopRated(limit = 100, mediaType = null) {
  const params = mediaType ? [limit, mediaType] : [limit];
  const whereClause = mediaType ? 'WHERE mi.media_type = $2' : '';

  const result = await pool.query(
    `SELECT mi.media_type, mi.external_id, mi.title, mi.image_url,
            AVG(r.rating)::numeric(10,2) AS average_rating, COUNT(r.id) AS review_count
     FROM media_items mi
     JOIN reviews r ON r.media_item_id = mi.id
     ${whereClause}
     GROUP BY mi.id
     ORDER BY average_rating DESC, review_count DESC
     LIMIT $1`,
    params
  );
  return result.rows;
}

// backend/db/queries/globalStats.js — add
async function getExternalTopRated(limit = 100, mediaType = null) {
  const params = mediaType ? [limit, mediaType] : [limit];
  const whereClause = mediaType
    ? 'WHERE mi.media_type = $2 AND mi.external_rating IS NOT NULL'
    : 'WHERE mi.external_rating IS NOT NULL';

  const result = await pool.query(
    `SELECT mi.media_type, mi.external_id, mi.title, mi.image_url,
            mi.external_rating, mi.external_rating_count
     FROM media_items mi
     ${whereClause}
     ORDER BY mi.external_rating DESC, mi.external_rating_count DESC NULLS LAST
     LIMIT $1`,
    params
  );
  return result.rows.map((r, idx) => ({
    rank: idx + 1,
    id: `${r.media_type}/${r.external_id}`,
    media: r.media_type,
    title: r.title,
    image: r.image_url,
    averageRating: parseFloat(r.external_rating),
    reviewCount: r.external_rating_count,
  }));
}

module.exports = { getGlobalTopRated, getExternalTopRated };