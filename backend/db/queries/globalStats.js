const pool = require('../pool');

/**
 * `perspective` scopes "user"/"friends" ratings to the requesting user
 * rather than a global aggregate — sortBy now covers all four columns.
 */
async function getTopRated({ limit = 100, mediaType = null, sortBy = 'whimsy', userId }) {
  const orderColMap = {
    whimsy: 'gr.avg_rating',
    external: 'mi.external_rating',
    user: 'ur.rating',
    friends: 'fr.avg_rating',
  };
  const orderCol = orderColMap[sortBy] || orderColMap.whimsy;

  const conditions = [`${orderCol} IS NOT NULL`];
  const params = [userId];
  if (mediaType) { params.push(mediaType); conditions.push(`mi.media_type = $${params.length}`); }
  params.push(limit);

  const result = await pool.query(
    `WITH my_friends AS (
       SELECT CASE WHEN f.requester_id = $1 THEN f.addressee_id ELSE f.requester_id END AS friend_id
       FROM friendships f WHERE (f.requester_id = $1 OR f.addressee_id = $1) AND f.status = 'accepted'
     ),
     friend_ratings AS (
       SELECT r.media_item_id, AVG(r.rating)::numeric(10,2) AS avg_rating,
              json_agg(json_build_object('username', u.username, 'rating', r.rating)) AS contributors
       FROM reviews r
       JOIN my_friends mf ON mf.friend_id = r.user_id
       JOIN users u ON u.id = r.user_id
       GROUP BY r.media_item_id
     )
     SELECT mi.media_type, mi.external_id, mi.title, mi.image_url,
            mi.external_rating, mi.external_rating_count,
            gr.avg_rating AS whimsy_rating, gr.rating_count AS whimsy_rating_count,
            ur.rating AS user_rating,
            fr.avg_rating AS friend_rating, fr.contributors AS friend_contributors
     FROM media_items mi
     LEFT JOIN (SELECT media_item_id, AVG(rating)::numeric(10,2) AS avg_rating, COUNT(*) AS rating_count FROM reviews GROUP BY media_item_id) gr
       ON gr.media_item_id = mi.id
     LEFT JOIN reviews ur ON ur.media_item_id = mi.id AND ur.user_id = $1
     LEFT JOIN friend_ratings fr ON fr.media_item_id = mi.id
     WHERE ${conditions.join(' AND ')}
     ORDER BY ${orderCol} DESC NULLS LAST
     LIMIT $${params.length}`,
    params
  );
  return result.rows;
}

module.exports = { getTopRated };