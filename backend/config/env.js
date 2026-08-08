const REQUIRED_VARS = [
  'DATABASE_URL', 'JWT_SECRET', 'TMDB_API_KEY', 'RAWG_API_KEY',
  'SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'GOOGLE_BOOKS_KEY',
];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

module.exports = validateEnv;