const tmdb = require('../external/tmdbService');
const rawg = require('../external/rawgService');
const spotify = require('../external/spotifyService');
const { anime, manga } = require('../external/jikanService');
const tvmaze = require('../external/tvmazeService');
const googleBooks = require('../external/googleBooksService');

/**
 * Single source of truth mapping a mediaType string to the adapter that
 * knows how to search/fetch it. Adding a new media type in the future is
 * a one-line addition here plus one new adapter file — nothing else in
 * the routing layer changes.
 */
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
  if (!adapter) {
    const err = new Error(`Unsupported media type: ${mediaType}`);
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