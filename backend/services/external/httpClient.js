const axios = require('axios');

/**
 * Shared axios instance for all external API calls. A hard timeout is
 * critical here — without one, a slow/throttled upstream (Jikan, RAWG)
 * will hang the request until the OS socket times out (seen as the
 * 19.5s RAWG 522 in production logs), instead of failing fast so we
 * can retry or return a clean error to the frontend.
 */
const httpClient = axios.create({
  timeout: 8000, // 8s — generous for a slow API, short enough to fail fast
});

module.exports = httpClient;