// backend/services/external/jikanService.js

const axios = require('axios');
const BASE_URL = 'https://api.jikan.moe/v4';

function makeJikanService(resourcePath) {
  return {
    async search(query, page = 1, limit = 15) {
      const response = await axios.get(`${BASE_URL}/${resourcePath}`, {
        params: { q: query, sfw: true, page, limit: Math.min(limit, 15) },
      });
      return {
        results: response.data.data || [],
        pagination: response.data.pagination || {},
      };
    },
    async getById(id) {
      const response = await axios.get(`${BASE_URL}/${resourcePath}/${id}/full`);
      return response.data.data;
    },
  };
}

module.exports = {
  anime: makeJikanService('anime'),
  manga: makeJikanService('manga'),
};