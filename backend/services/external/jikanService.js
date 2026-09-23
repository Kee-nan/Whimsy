// backend/services/external/jikanService.js

const httpClient = require('./httpClient');
const withRetry = require('./withRetry');

const BASE_URL = 'https://api.jikan.moe/v4';

function makeJikanService(resourcePath) {
  return {
    async search(query, page = 1, limit = 15) {
      return withRetry(async () => {
        const response = await httpClient.get(`${BASE_URL}/${resourcePath}`, {
          params: { q: query, sfw: true, page, limit: Math.min(limit, 15) },
        });
        return {
          results: response.data.data || [],
          pagination: response.data.pagination || {},
        };
      });
    },
    async getById(id) {
      return withRetry(async () => {
        const response = await httpClient.get(`${BASE_URL}/${resourcePath}/${id}/full`);
        return response.data; // keep Jikan's { data: {...} } wrapper — extractDetails expects it
      });
    },
  };
}

module.exports = {
  anime: makeJikanService('anime'),
  manga: makeJikanService('manga'),
};