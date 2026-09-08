const pool = require('../pool');

async function getTopRated({ limit = 100, mediaType = null, sortBy = 'whimsy' } = {}) {
  const orderCol = sortBy === 'external' ? 'mi.external_rating' : 'gr.avg_rating';
  const conditions = [`${orderCol} IS NOT NULL`];
  const params = [];
  if (mediaType) { params.push(mediaType); conditions.push(`mi.media_type = $${params.length}`); }
  params.push(limit);

  const result = await pool.query(
    `SELECT mi.media_type, mi.external_id, mi.title, mi.image_url,
            mi.external_rating, mi.external_rating_count,
            gr.avg_rating AS whimsy_rating, gr.rating_count AS whimsy_rating_count
     FROM media_items mi
     LEFT JOIN (
       SELECT media_item_id, AVG(rating)::numeric(10,2) AS avg_rating, COUNT(*) AS rating_count
       FROM reviews GROUP BY media_item_id
     ) gr ON gr.media_item_id = mi.id
     WHERE ${conditions.join(' AND ')}
     ORDER BY ${orderCol} DESC NULLS LAST
     LIMIT $${params.length}`,
    params
  );
  return result.rows;
}

module.exports = { getTopRated };