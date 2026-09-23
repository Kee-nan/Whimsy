module.exports = async () => {
  const pool = require('../../db/pool');
  await pool.end();
};