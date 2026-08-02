const pool = require('../pool');

async function sendRequest(requesterId, addresseeId) {
  const result = await pool.query(
    `INSERT INTO friendships (requester_id, addressee_id, status)
     VALUES ($1, $2, 'pending')
     ON CONFLICT (requester_id, addressee_id) DO NOTHING
     RETURNING *`,
    [requesterId, addresseeId]
  );
  return result.rows[0] || null;
}

async function getPendingForUser(userId) {
  // requests where I am the addressee and status is still pending
  const result = await pool.query(
    `SELECT f.id AS friendship_id, u.id, u.username
     FROM friendships f
     JOIN users u ON u.id = f.requester_id
     WHERE f.addressee_id = $1 AND f.status = 'pending'`,
    [userId]
  );
  return result.rows;
}

async function accept(friendshipId, userId) {
  // only the addressee can accept
  const result = await pool.query(
    `UPDATE friendships SET status = 'accepted', updated_at = now()
     WHERE id = $1 AND addressee_id = $2
     RETURNING *`,
    [friendshipId, userId]
  );
  return result.rows[0] || null;
}

async function decline(friendshipId, userId) {
  const result = await pool.query(
    `UPDATE friendships SET status = 'declined', updated_at = now()
     WHERE id = $1 AND addressee_id = $2
     RETURNING *`,
    [friendshipId, userId]
  );
  return result.rows[0] || null;
}

async function getAcceptedForUser(userId) {
  // friendships are directional rows but "accepted" means mutual — union both directions
  const result = await pool.query(
    `SELECT u.id, u.username FROM friendships f
     JOIN users u ON u.id = CASE WHEN f.requester_id = $1 THEN f.addressee_id ELSE f.requester_id END
     WHERE (f.requester_id = $1 OR f.addressee_id = $1) AND f.status = 'accepted'`,
    [userId]
  );
  return result.rows;
}

async function remove(userId, friendId) {
  await pool.query(
    `DELETE FROM friendships
     WHERE (requester_id = $1 AND addressee_id = $2)
        OR (requester_id = $2 AND addressee_id = $1)`,
    [userId, friendId]
  );
}

async function areFriends(userId, otherUserId) {
  const result = await pool.query(
    `SELECT 1 FROM friendships
     WHERE ((requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1))
       AND status = 'accepted'`,
    [userId, otherUserId]
  );
  return result.rowCount > 0;
}

async function searchUsers(query, excludeUserId) {
  // fixes audit bug #13 — this is one real WHERE clause with both conditions, not two colliding keys
  const result = await pool.query(
    `SELECT id, username FROM users
     WHERE username ILIKE $1 AND id != $2
       AND id NOT IN (
         SELECT CASE WHEN requester_id = $2 THEN addressee_id ELSE requester_id END
         FROM friendships
         WHERE (requester_id = $2 OR addressee_id = $2) AND status = 'accepted'
       )
     LIMIT 10`,
    [`%${query}%`, excludeUserId]
  );
  return result.rows;
}

module.exports = {
  sendRequest, getPendingForUser, accept, decline,
  getAcceptedForUser, remove, areFriends, searchUsers,
};