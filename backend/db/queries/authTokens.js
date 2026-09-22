const pool = require('../pool');

async function createRefreshToken(userId, tokenHash, expiresAt) {
  const result = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3) RETURNING *`,
    [userId, tokenHash, expiresAt]
  );
  return result.rows[0];
}

async function findRefreshToken(tokenHash) {
  const result = await pool.query(`SELECT * FROM refresh_tokens WHERE token_hash = $1`, [tokenHash]);
  return result.rows[0] || null;
}

async function revokeRefreshToken(id) {
  await pool.query(`UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1`, [id]);
}

/** Nuclear option — called if token-reuse (theft) is detected, or on password reset. */
async function revokeAllRefreshTokensForUser(userId) {
  await pool.query(`UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`, [userId]);
}

module.exports = { createRefreshToken, findRefreshToken, revokeRefreshToken, revokeAllRefreshTokensForUser };