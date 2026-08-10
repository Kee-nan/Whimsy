const tmdb = require('../external/tmdbService');
const rawg = require('../external/rawgService');
const spotify = require('../external/spotifyService');
const { anime, manga } = require('../external/jikanService');
const tvmaze = require('../external/tvmazeService');
const googleBooks = require('../external/googleBooksService');

const ADAPTERS = {
  movie: tmdb,
  game: rawg,
  album: spotify,
  anime,
  manga,
  show: tvmaze,
  book: googleBooks,
};

function getAdapter(mediaType) {
  const adapter = ADAPTERS[mediaType];
  // This check is what would have caught the book bug immediately with a
  // clear message, instead of a cryptic "search is not a function" crash.
  if (!adapter || typeof adapter.search !== 'function' || typeof adapter.getById !== 'function') {
    const err = new Error(
      `No valid adapter registered for media type "${mediaType}". Available: ${Object.keys(ADAPTERS).join(', ')}`
    );
    err.status = 400;
    throw err;
  }
  return adapter;
}

async function search(mediaType, query, page, limit) {
  return getAdapter(mediaType).search(query, page, limit);
}

async function getById(mediaType, externalId) {
  return getAdapter(mediaType).getById(externalId);
}

module.exports = { search, getById, ADAPTERS };