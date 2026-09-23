const httpClient = require('./httpClient');
const withRetry = require('./withRetry');

const BASE_URL = 'https://api.tenrai.org/v1';

/**
 * Tenrai replaces Jikan as the MyAnimeList-data source (Jikan became
 * unreliable/rate-limited — see the 504s in production logs). Tenrai's
 * response shapes are Jikan-compatible: { pagination, data: [...] } for
 * search, { data: {...} } for full-detail lookups — so nothing on the
 * frontend's extractAnimeDetails/extractMangaDetails needs to change.
 */
function makeTenraiService(resourcePath) {
  return {
    async search(query, page = 1, limit = 15) {
      return withRetry(async () => {
        const response = await httpClient.get(`${BASE_URL}/${resourcePath}`, {
          params: {
            q: query,
            page,
            limit: Math.min(limit, 50), // Tenrai's documented max, vs Jikan's 15
          },
        });
        return {
          results: response.data.data || [],
          pagination: response.data.pagination || {},
        };
      });
    },

    async getById(id) {
      return withRetry(async () => {
        const response = await httpClient.get(`${BASE_URL}/${resourcePath}/${id}/full`, {
          params: { sfw: true },
        });
        return response.data; // { data: {...} } — matches Jikan's wrapper shape
      });
    },
  };
}

module.exports = {
  anime: makeTenraiService('anime'),
  manga: makeTenraiService('manga'),
};