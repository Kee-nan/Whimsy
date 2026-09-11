/**
 * Safely extracts the external ID portion from either a composite
 * "mediaType/externalId" string OR a raw external ID that might arrive
 * as a number (e.g. from CSV import, where IDs come straight off TMDB/
 * RAWG/Tenrai responses without being stringified first).
 */
function splitMediaId(rawId) {
  const idStr = String(rawId);
  if (idStr.includes('/')) {
    const [, ...rest] = idStr.split('/');
    return rest.join('/');
  }
  return idStr;
}

module.exports = { splitMediaId };