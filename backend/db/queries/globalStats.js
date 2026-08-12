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

module.exports = { getGlobalTopRated };