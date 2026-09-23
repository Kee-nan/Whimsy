// backend/services/external/normalizeRating.js
const NORMALIZERS = {
  movie: (raw) => raw.vote_average != null ? { rating: (raw.vote_average / 10) * 30, count: raw.vote_count } : null,
  game:  (raw) => raw.rating != null ? { rating: (raw.rating / 5) * 30, count: raw.ratings_count } : null,
  anime: (raw) => raw.score != null ? { rating: (raw.score / 10) * 30, count: raw.scored_by } : null,
  manga: (raw) => raw.score != null ? { rating: (raw.score / 10) * 30, count: raw.scored_by } : null,
  show:  (raw) => raw.rating?.average != null ? { rating: (raw.rating.average / 10) * 30, count: null } : null,
  book:  (raw) => raw.volumeInfo?.averageRating != null ? { rating: (raw.volumeInfo.averageRating / 5) * 30, count: raw.volumeInfo.ratingsCount } : null,
  album: () => null, // Spotify exposes no album-level rating — falls back to Whimsy's own average
};

function normalizeExternalRating(mediaType, rawApiData) {
  const fn = NORMALIZERS[mediaType];
  const result = fn ? fn(rawApiData) : null;
  return result ? { externalRating: Math.round(result.rating * 100) / 100, externalRatingCount: result.count || null } : { externalRating: null, externalRatingCount: null };
}

module.exports = { normalizeExternalRating };