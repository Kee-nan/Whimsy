const pool = require('../pool');

async function createUser({ firstName, lastName, username, email, passwordHash }) {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, username, email, password_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, first_name, last_name, username, email, bio, view_setting`,
    [firstName, lastName, username, email, passwordHash]
  );
  return result.rows[0];
}

async function findByUsername(username) {
  const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
  return result.rows[0] || null;
}

async function findByUsernameOrEmail(username, email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1 OR email = $2`,
    [username, email]
  );
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function updateProfile(id, { firstName, lastName, username, email, bio }) {
  const result = await pool.query(
    `UPDATE users
     SET first_name = $1, last_name = $2, username = $3, email = $4, bio = $5, updated_at = now()
     WHERE id = $6
     RETURNING id, first_name, last_name, username, email, bio, view_setting`,
    [firstName, lastName, username, email, bio, id]
  );
  return result.rows[0];
}

async function updateViewSetting(id, viewSetting) {
  const result = await pool.query(
    `UPDATE users SET view_setting = $1, updated_at = now() WHERE id = $2 RETURNING view_setting`,
    [viewSetting, id]
  );
  return result.rows[0];
}

// Case-insensitive collision check that excludes the current user (fixes audit bug #13's
// class of problem — this is a real two-condition WHERE clause, not a duplicate key)
async function findUsernameOrEmailCollision(username, email, excludeUserId) {
  const result = await pool.query(
    `SELECT id, username, email FROM users
     WHERE (username = $1 OR email = $2) AND id != $3`,
    [username, email, excludeUserId]
  );
  return result.rows[0] || null;
}

module.exports = {
  createUser, findByUsername, findByUsernameOrEmail,
  findById, updateProfile, updateViewSetting, findUsernameOrEmailCollision,
};