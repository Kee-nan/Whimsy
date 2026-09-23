const crypto = require('crypto');

/** Raw, URL-safe random token — this is what's emailed/cookied to the user. */
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/** Only the hash is ever stored in the DB — never the raw token itself,
    so a DB leak alone can't be used to impersonate anyone. */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { generateToken, hashToken };